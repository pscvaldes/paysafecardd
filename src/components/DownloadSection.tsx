const appIllustrationUrl = "/images/psc-app-illustration.webp";

export default function DownloadSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 50% 45%, #1A45D2 0%, #1236B8 100%),
          #1236B8
        `,
      }}
    >
      {/* Soft glow for separation */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px bg-white/10"
          aria-hidden
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - text + buttons */}
          <div className="order-2 lg:order-1">
            <h2 className="text-white font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl leading-tight">
              Download the paysafecard app.
            </h2>
            <p className="mt-5 text-white/85 text-base md:text-lg leading-relaxed max-w-xl">
              Download the app for the best paysafecard experience. Full control
              of your online payments, even on the go.
            </p>

            {/* Store buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=at.paysafecard.android&referrer=adjust_reftag%3DcIGmAvoU2TFcK%26utm_source%3DWebsite%2B-%2BApp%2BSeite&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white rounded-xl px-5 py-3 hover:bg-neutral-900 transition shadow-lg min-w-[180px]"
                aria-label="Get it on Google Play"
              >
                <svg
                  viewBox="0 0 512 512"
                  width="28"
                  height="28"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="gpBlue" x1="261.7" y1="65" x2="12.8" y2="314" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#00A0FF"/>
                      <stop offset=".007" stopColor="#00A1FF"/>
                      <stop offset=".26" stopColor="#00BEFF"/>
                      <stop offset=".512" stopColor="#00D2FF"/>
                      <stop offset=".76" stopColor="#00DFFF"/>
                      <stop offset="1" stopColor="#00E3FF"/>
                    </linearGradient>
                    <linearGradient id="gpGreen" x1="409.99" y1="261.37" x2="67.35" y2="261.37" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#FFE000"/>
                      <stop offset=".409" stopColor="#FFBD00"/>
                      <stop offset=".775" stopColor="#FFA500"/>
                      <stop offset="1" stopColor="#FF9C00"/>
                    </linearGradient>
                    <linearGradient id="gpRed" x1="291.35" y1="297.37" x2="8.95" y2="614.77" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#FF3A44"/>
                      <stop offset="1" stopColor="#C31162"/>
                    </linearGradient>
                    <linearGradient id="gpYellow" x1="49.27" y1=".18" x2="222.97" y2="173.88" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#32A071"/>
                      <stop offset=".069" stopColor="#2DA771"/>
                      <stop offset=".476" stopColor="#15CF74"/>
                      <stop offset=".801" stopColor="#06E775"/>
                      <stop offset="1" stopColor="#00F076"/>
                    </linearGradient>
                  </defs>
                  <path d="M89.6 43.5c-7.8 8.3-12.3 21-12.3 37.2v350.6c0 16.2 4.5 28.9 12.3 37.2l1.9 1.8L270 292v-6.6-6.6L91.5 41.7l-1.9 1.8z" fill="url(#gpBlue)"/>
                  <path d="M329.4 351.6L270 292v-13.2l59.4-59.4 1.3.8L402 260c21.4 12.2 21.4 32 0 44.2l-71.3 40.6-1.3.8z" fill="url(#gpGreen)"/>
                  <path d="M331.7 352.4L270 290.8 89.6 468.5c7 7.5 18.6 8.4 31.5 1.2l210.6-117.3z" fill="url(#gpRed)"/>
                  <path d="M331.7 159.6L121.1 42.3c-12.9-7.2-24.5-6.3-31.5 1.2L270 221.2l61.7-61.6z" fill="url(#gpYellow)"/>
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    Get it on
                  </span>
                  <span className="text-sm md:text-base font-semibold">
                    Google Play
                  </span>
                </div>
              </a>

              {/* App Store */}
              <a
                href="https://apps.apple.com/us/app/paysafecard-prepaid-payments/id588324792"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white rounded-xl px-5 py-3 hover:bg-neutral-900 transition shadow-lg min-w-[180px]"
                aria-label="Download on the App Store"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M17.05 12.04c-.03-3.1 2.53-4.59 2.65-4.66-1.44-2.11-3.68-2.4-4.48-2.43-1.9-.19-3.73 1.12-4.7 1.12-.99 0-2.5-1.09-4.11-1.06-2.11.03-4.07 1.23-5.16 3.13-2.21 3.83-.56 9.5 1.59 12.6 1.05 1.52 2.31 3.24 3.96 3.18 1.6-.06 2.2-1.03 4.13-1.03 1.92 0 2.47 1.03 4.15.99 1.71-.03 2.8-1.55 3.84-3.07 1.22-1.78 1.72-3.5 1.74-3.59-.04-.02-3.34-1.28-3.37-5.08l.1-.1z" />
                  <path d="M14.02 3.18c.88-1.07 1.47-2.55 1.31-4.02-1.27.05-2.8.84-3.71 1.91-.81.94-1.52 2.45-1.33 3.89 1.41.11 2.85-.72 3.73-1.78z" />
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    Download on the
                  </span>
                  <span className="text-sm md:text-base font-semibold">
                    App Store
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right column - app illustration */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <img
              src={appIllustrationUrl}
              alt="paysafecard app illustration"
              className="w-full max-w-[480px] h-auto select-none"
              style={{
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.25))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
