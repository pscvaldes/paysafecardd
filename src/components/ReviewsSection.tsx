import { useState, useEffect, useRef, useCallback } from "react";

/* ───────────────────────── Data ───────────────────────── */

interface Review {
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

const reviews: Review[] = [
  {
    title: "Great experience",
    excerpt:
      "I had a great experience using paysafecard. The process was fast, smooth and the app keeps track of everything in a super clear way.",
    author: "Adrian Campeanu",
    date: "May 22",
  },
  {
    title: "Simple and reliable",
    excerpt:
      "Been using paysafecard for years. Simple, reliable and it just works. The mobile app makes it even easier to manage my balance.",
    author: "Julia Hoffmann",
    date: "June 3",
  },
  {
    title: "Super convenient",
    excerpt:
      "Super convenient for online shopping. I love that I can top up my balance and pay without sharing any banking details.",
    author: "Marco Rossi",
    date: "June 10",
  },
  {
    title: "Fast and secure",
    excerpt:
      "Fast and secure way to pay online. The 16-digit code is easy to use and the balance check is instant. Highly recommended.",
    author: "Sophie Laurent",
    date: "June 15",
  },
  {
    title: "Love the new app",
    excerpt:
      "The new app is a massive improvement. Clean design, quick top-up, and all my transactions in one place. Great job paysafecard!",
    author: "Tom Bakker",
    date: "June 18",
  },
];

/* ───────────────────────── Stars ───────────────────────── */

function TrustpilotStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="2" fill="#00B67A" />
      <path
        d="M12 4L14.1 9.6L20 10.1L15.5 14L16.9 19.8L12 16.8L7.1 19.8L8.5 14L4 10.1L9.9 9.6L12 4Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <TrustpilotStar key={i} />
      ))}
    </div>
  );
}

/* ───────────────────────── Card ───────────────────────── */

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation per card
          setTimeout(() => setVisible(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <article
      ref={ref}
      className="flex-shrink-0 flex flex-col"
      style={{
        width: 295,
        minHeight: 220,
        backgroundColor: "#F7F7F7",
        borderRadius: 0,
        padding: 22,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {/* Stars + Invited */}
      <div className="flex items-center justify-between">
        <StarRow />
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "#555555" }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11L3 8.5L4 7.5L6 9.5L12 3.5L13 4.5L6 11Z" fill="#555555" />
          </svg>
          Invited
        </span>
      </div>

      {/* Title */}
      <h3
        className="mt-4 font-bold"
        style={{ fontSize: 20, lineHeight: 1.3, color: "#111111" }}
      >
        {review.title}
      </h3>

      {/* Body — max 3 lines with ellipsis */}
      <p
        className="mt-2 flex-1"
        style={{
          fontSize: 16,
          lineHeight: 1.5,
          color: "#555555",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {review.excerpt}
      </p>

      {/* Author + date — pinned to bottom */}
      <div className="mt-4" style={{ fontSize: 14, color: "#111111" }}>
        <span className="font-bold">{review.author}</span>
        <span style={{ fontWeight: 400 }}>, {review.date}</span>
      </div>
    </article>
  );
}

/* ─────────────────── Navigation Arrow ─────────────────── */

function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={direction === "right" ? "Next reviews" : "Previous reviews"}
      className="flex items-center justify-center transition-colors"
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid #111111",
        backgroundColor: hovered ? "#111111" : "transparent",
        color: hovered ? "#FFFFFF" : "#111111",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "right" ? (
          <path d="M9 5l7 7-7 7" />
        ) : (
          <path d="M15 5l-7 7 7 7" />
        )}
      </svg>
    </button>
  );
}

/* ──────────────── Trustpilot Logo ──────────────── */

function TrustpilotLogo() {
  return (
    <div className="inline-flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z"
          fill="#00B67A"
        />
      </svg>
      <span
        className="font-bold tracking-tight"
        style={{ fontSize: 18, color: "#111111" }}
      >
        Trustpilot
      </span>
    </div>
  );
}

/* ──────────────── Main Section ──────────────── */

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 295 + 32; // card + gap
    container.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      className="bg-white"
      style={{ padding: "100px 80px" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* ── Heading ── */}
        <div className="text-center">
          <h2
            className="uppercase"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(20px, 3.5vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              color: "#111111",
            }}
          >
            Don't listen to us. Listen to our customers.
          </h2>
        </div>

        {/* Nav arrows — desktop only */}
        <div className="hidden md:flex items-center justify-end gap-3 mt-8">
          <NavArrow direction="left" onClick={() => scroll("left")} />
          <NavArrow direction="right" onClick={() => scroll("right")} />
        </div>

        {/* ── Carousel ── */}
        <div
          ref={scrollRef}
          className="mt-12 flex gap-8 overflow-x-auto scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
        >
          <style>{`
            .reviews-scroll::-webkit-scrollbar { display: none; }
          `}</style>
          {reviews.map((r, i) => (
            <div key={r.title} style={{ scrollSnapAlign: "start" }}>
              <ReviewCard review={r} index={i} />
            </div>
          ))}
        </div>

        {/* Nav arrows — mobile only */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-8">
          <NavArrow direction="left" onClick={() => scroll("left")} />
          <NavArrow direction="right" onClick={() => scroll("right")} />
        </div>

        {/* ── Footer / Trustpilot ── */}
        <div className="mt-9 flex flex-col items-center text-center gap-3">
          <p style={{ fontSize: 16, color: "#555555" }}>
            Rated{" "}
            <span className="font-bold" style={{ color: "#111111" }}>
              4.6 / 5
            </span>{" "}
            based on{" "}
            <span className="font-bold" style={{ color: "#111111" }}>
              87,201 reviews
            </span>
            .
            <br />
            Showing our favorite reviews.
          </p>
          <TrustpilotLogo />
        </div>
      </div>
    </section>
  );
}
