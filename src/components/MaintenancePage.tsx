import { useEffect, useState } from "react";

interface MaintenancePageProps {
  onAdmin: () => void;
}

export default function MaintenancePage({ onAdmin }: MaintenancePageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <div
        style={{
          width: "92%",
          maxWidth: 520,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Top — Red/Orange warning banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #EA580C 100%)",
              padding: "40px 32px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.5px", margin: 0 }}>
              Service Temporarily Unavailable
            </h1>
          </div>

          {/* Bottom — Content */}
          <MaintenanceContent />
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 20 }}>
          We apologize for the inconvenience.
        </p>
      </div>

      {/* Subtle admin access button */}
      <button
        onClick={onAdmin}
        className="absolute right-3 bottom-2 opacity-[0.06] hover:opacity-25 transition-opacity duration-500 text-white text-[8px] cursor-default select-none"
        style={{ background: "none", border: "none", padding: "4px 6px" }}
        aria-label="Admin"
        tabIndex={-1}
      >
        ●
      </button>
    </div>
  );
}

function MaintenanceContent() {
  return (
    <div style={{ padding: "36px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 600, color: "#1E293B", margin: "0 0 12px 0" }}>
        Hosting Payment Overdue
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.65, color: "#64748B", maxWidth: 400, margin: "0 0 24px 0" }}>
        This website is currently suspended due to an outstanding hosting payment.
        The service will be restored once the payment has been processed.
      </p>
      <div style={{ width: "100%", height: 1, backgroundColor: "#E2E8F0", margin: "0 0 24px 0" }} />
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#94A3B8", margin: "0 0 20px 0" }}>
        If you are the website owner, please contact your hosting provider
        to resolve the payment issue and restore access.
      </p>
      <ContactBox />
      <p style={{ fontFamily: "'Inter', monospace", fontSize: 11, color: "#CBD5E1", marginTop: 20, letterSpacing: "0.3px" }}>
        Error 402 — Payment Required
      </p>
    </div>
  );
}

function ContactBox() {
  return (
    <div style={{ width: "100%", backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "16px 20px", textAlign: "left" }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
        Contact Hosting Provider
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#475569" }}>support@hostingprovider.com</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#475569" }}>www.hostingprovider.com</span>
        </div>
      </div>
    </div>
  );
}