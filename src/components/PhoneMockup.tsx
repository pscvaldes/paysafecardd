export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] h-full flex items-center justify-center">
      {/* Hand silhouette behind the phone */}
      <div className="absolute -bottom-4 right-0 left-0 flex justify-center opacity-80">
        <svg
          viewBox="0 0 400 200"
          className="w-[340px] h-[140px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 200 C 40 120, 100 90, 170 100 L 230 110 C 260 115, 290 130, 310 160 C 325 185, 330 200, 330 200 Z"
            fill="#F4C9A8"
          />
          <path
            d="M100 100 C 120 80, 150 75, 180 85 L 200 95"
            stroke="#E5A988"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Phone */}
      <div className="relative z-10 w-[240px] h-[470px] rounded-[42px] bg-slate-900 p-2 shadow-2xl ring-4 ring-slate-800">
        {/* Screen */}
        <div className="relative w-full h-full rounded-[32px] bg-white overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 bg-[#1236B8] text-white text-[11px] font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>●●●</span>
              <span>100%</span>
            </div>
          </div>
          {/* Header */}
          <div className="bg-[#1236B8] px-5 pb-5 pt-3 text-white">
            <div className="text-[10px] uppercase tracking-wider opacity-80">
              paysafecard
            </div>
            <div className="mt-1 text-[11px] opacity-90">
              Welcome back
            </div>
          </div>
          {/* Balance card */}
          <div className="px-4 -mt-3">
            <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                Your balance
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                € 24.50
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-3/5 bg-[#00B67A] rounded-full" />
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-slate-500">
                <span>Spent € 15.50</span>
                <span>of € 40.00</span>
              </div>
            </div>
          </div>
          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-2 px-4 mt-4">
            {[
              { icon: "➕", label: "Top up" },
              { icon: "↗", label: "Send" },
              { icon: "🛒", label: "Shop" },
            ].map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center justify-center bg-slate-50 rounded-xl py-2"
              >
                <div className="text-lg">{a.icon}</div>
                <div className="text-[9px] text-slate-700 font-medium mt-0.5">
                  {a.label}
                </div>
              </div>
            ))}
          </div>
          {/* Transactions */}
          <div className="px-4 mt-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
              Recent activity
            </div>
            {[
              { name: "Spotify", amount: "-€ 9.99", color: "#1DB954" },
              { name: "Netflix", amount: "-€ 5.51", color: "#E50914" },
              { name: "Top up", amount: "+€ 40.00", color: "#00B67A" },
            ].map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: t.color }}
                  >
                    {t.name[0]}
                  </div>
                  <div className="text-[11px] font-medium text-slate-800">
                    {t.name}
                  </div>
                </div>
                <div
                  className={`text-[11px] font-semibold ${
                    t.amount.startsWith("+") ? "text-[#00B67A]" : "text-slate-700"
                  }`}
                >
                  {t.amount}
                </div>
              </div>
            ))}
          </div>
          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-slate-100 flex items-center justify-around">
            <div className="w-4 h-4 rounded bg-[#1236B8]" />
            <div className="w-4 h-4 rounded bg-slate-300" />
            <div className="w-4 h-4 rounded bg-slate-300" />
            <div className="w-4 h-4 rounded bg-slate-300" />
          </div>
        </div>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full" />
      </div>
    </div>
  );
}
