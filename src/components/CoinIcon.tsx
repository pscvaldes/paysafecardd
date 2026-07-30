interface CoinIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hexagonal/octagonal 3D coin token.
 * Rendered as inline SVG => truly transparent background,
 * infinitely scalable, and NOT downloadable (no image file,
 * no "Save image as" in the context menu).
 */
export default function CoinIcon({
  size = 120,
  className = "",
  style,
}: CoinIconProps) {
  // Octagon top-face vertices (flattened + slightly rotated)
  const face = "28,54 58,20 108,8 166,22 194,58 164,96 112,112 54,96";
  // Extrusion offset (down / slightly left) to fake the 3D thickness
  const dx = -7;
  const dy = 17;
  const bottom = face
    .split(" ")
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return `${x + dx},${y + dy}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={(size * 150) / 220}
      viewBox="0 0 220 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Subtle sheen on the white face */}
        <linearGradient id="coinFace" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        {/* Side wall shading */}
        <linearGradient id="coinSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      {/* --- Extruded body (bottom silhouette + connecting walls) --- */}
      <polygon points={bottom} fill="url(#coinSide)" />
      {(() => {
        const f = face.split(" ").map((p) => p.split(",").map(Number));
        return f.map((pt, i) => {
          const nxt = f[(i + 1) % f.length];
          const quad = [
            `${pt[0]},${pt[1]}`,
            `${nxt[0]},${nxt[1]}`,
            `${nxt[0] + dx},${nxt[1] + dy}`,
            `${pt[0] + dx},${pt[1] + dy}`,
          ].join(" ");
          return <polygon key={i} points={quad} fill="url(#coinSide)" />;
        });
      })()}

      {/* --- White top face --- */}
      <polygon
        points={face}
        fill="url(#coinFace)"
        stroke="#000000"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* --- Inner engraved ellipse --- */}
      <ellipse
        cx="111"
        cy="60"
        rx="62"
        ry="40"
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        transform="rotate(-9 111 60)"
      />

      {/* --- Blue dollar sign with black outline --- */}
      <text
        x="111"
        y="86"
        textAnchor="middle"
        fontFamily="Inter, Arial Black, sans-serif"
        fontSize="76"
        fontWeight="900"
        fontStyle="italic"
        fill="#2233CC"
        stroke="#000000"
        strokeWidth="4"
        paintOrder="stroke"
        strokeLinejoin="round"
        transform="rotate(-9 111 60)"
      >
        $
      </text>
    </svg>
  );
}
