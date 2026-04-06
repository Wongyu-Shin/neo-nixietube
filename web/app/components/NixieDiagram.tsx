/**
 * SVG diagram showing Nixie tube cross-section structure.
 * Shows: glass envelope, cathode digits, anode mesh, pins, fill gas.
 */
export default function NixieDiagram() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 400 320" className="w-full max-w-md mx-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="400" height="320" fill="#0D0D0D" rx="8" />

        {/* Glass envelope */}
        <ellipse cx="200" cy="140" rx="100" ry="130" fill="none" stroke="#D4A853" strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />
        <ellipse cx="200" cy="140" rx="96" ry="126" fill="#D4A85308" stroke="none" />

        {/* Label: Glass Envelope */}
        <text x="310" y="80" fill="#D4A853" fontSize="10" opacity="0.7">Glass</text>
        <text x="310" y="92" fill="#D4A853" fontSize="10" opacity="0.7">Envelope</text>
        <line x1="300" y1="85" x2="270" y2="100" stroke="#D4A853" strokeWidth="0.5" opacity="0.5" />

        {/* Anode mesh (front) */}
        <rect x="155" y="50" width="90" height="120" fill="none" stroke="#7B9EB8" strokeWidth="1.5" rx="4" opacity="0.6" />
        {/* Mesh grid lines */}
        {[60, 70, 80, 90, 100, 110, 120, 130, 140, 150].map(y => (
          <line key={`h${y}`} x1="157" y1={y} x2="243" y2={y} stroke="#7B9EB8" strokeWidth="0.3" opacity="0.3" />
        ))}
        {[165, 175, 185, 195, 205, 215, 225, 235].map(x => (
          <line key={`v${x}`} x1={x} y1="52" x2={x} y2="168" stroke="#7B9EB8" strokeWidth="0.3" opacity="0.3" />
        ))}
        <text x="155" y="185" fill="#7B9EB8" fontSize="9" textAnchor="middle">Anode Mesh</text>

        {/* Cathode digits (stacked) */}
        <text x="200" y="125" fill="#FF8C42" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="monospace" opacity="0.9">8</text>
        <text x="196" y="121" fill="#FF6B35" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="monospace" opacity="0.4">3</text>
        <text x="192" y="117" fill="#FF4500" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="monospace" opacity="0.2">7</text>

        {/* Glow effect around active digit */}
        <ellipse cx="200" cy="110" rx="30" ry="35" fill="#FF8C42" opacity="0.08" />
        <ellipse cx="200" cy="110" rx="22" ry="28" fill="#FF8C42" opacity="0.12" />

        {/* Label: Cathode Digits */}
        <text x="80" y="100" fill="#FF8C42" fontSize="10" textAnchor="end">Cathode</text>
        <text x="80" y="112" fill="#FF8C42" fontSize="10" textAnchor="end">Digits (0-9)</text>
        <line x1="85" y1="105" x2="165" y2="110" stroke="#FF8C42" strokeWidth="0.5" opacity="0.5" />

        {/* Pins */}
        {[160, 175, 190, 200, 210, 225, 240].map((x, i) => (
          <g key={`pin${i}`}>
            <line x1={x} y1="230" x2={x} y2="290" stroke="#B8A9C9" strokeWidth="1.5" />
            <circle cx={x} cy="290" r="3" fill="#B8A9C9" opacity="0.6" />
          </g>
        ))}
        <text x="200" y="310" fill="#B8A9C9" fontSize="9" textAnchor="middle">Pins (Dumet wire through glass seal)</text>

        {/* Base seal */}
        <rect x="140" y="225" width="120" height="10" fill="#D4A853" opacity="0.15" rx="2" />
        <rect x="140" y="225" width="120" height="10" fill="none" stroke="#D4A853" strokeWidth="1" opacity="0.4" rx="2" />
        <text x="270" y="233" fill="#D4A853" fontSize="8" opacity="0.6">Glass-Metal Seal</text>

        {/* Fill gas label */}
        <text x="200" y="205" fill="#6BA368" fontSize="10" textAnchor="middle" opacity="0.8">Ne 15 Torr</text>
        <text x="200" y="217" fill="#6BA368" fontSize="8" textAnchor="middle" opacity="0.5">(neon fill gas)</text>

        {/* Title */}
        <text x="200" y="25" fill="#e8e8e8" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Nixie Tube Cross-Section</text>
      </svg>
      <figcaption className="text-center text-stone-500 text-sm mt-2">
        닉시관 단면도 — 유리 외피 안에 숫자 형상 음극이 적층되고, 네온 가스가 봉입된 구조
      </figcaption>
    </figure>
  )
}
