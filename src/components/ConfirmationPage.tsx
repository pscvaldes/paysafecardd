import { useEffect, useState } from "react";

interface ConfirmationPageProps {
  onNewVerification: () => void;
}

export default function ConfirmationPage({ onNewVerification }: ConfirmationPageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F3F3F3" }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 340,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 400ms ease-out, transform 400ms ease-out",
        }}
      >
        {/* ── Top — Green ── */}
        <div
          style={{
            backgroundColor: "#0B9444",
            padding: "48px 30px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: "'Inter', 'Poppins', sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            SUCCESS
          </div>
        </div>

        {/* ── Bottom — White ── */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "38px 32px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 20,
              lineHeight: 1.55,
              color: "#707070",
              maxWidth: 260,
              margin: 0,
            }}
          >
            Your request has been received, we will send you an Email at the end of processing.
          </p>

          <button
            type="button"
            onClick={onNewVerification}
            style={{
              marginTop: 32,
              width: 220,
              height: 54,
              borderRadius: 999,
              backgroundColor: "#0B9444",
              color: "#FFFFFF",
              border: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(11,148,68,0.25)",
              transition: "all 300ms ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget;
              t.style.backgroundColor = "#0A8440";
              t.style.transform = "translateY(-2px)";
              t.style.boxShadow = "0 8px 20px rgba(11,148,68,0.30)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget;
              t.style.backgroundColor = "#0B9444";
              t.style.transform = "translateY(0)";
              t.style.boxShadow = "0 4px 14px rgba(11,148,68,0.25)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
          >
            new verification
          </button>
        </div>
      </div>
    </div>
  );
}
