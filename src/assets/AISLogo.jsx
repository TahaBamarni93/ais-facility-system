// AIS Logo — recreated from door label design
// Circular badge: navy ring, gold accents, book with rays, "AIS 2018"

export function AISLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48" fill="#C9A84C" />
      {/* Inner navy circle */}
      <circle cx="50" cy="50" r="44" fill="#0D1B3E" />
      {/* Inner white ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Book base */}
      <rect x="30" y="52" width="40" height="22" rx="2" fill="white" />
      {/* Book spine */}
      <rect x="48" y="50" width="4" height="26" rx="1" fill="#C9A84C" />
      {/* Book pages left */}
      <path d="M30 52 Q37 48 48 50 L48 74 Q37 72 30 74 Z" fill="white" opacity="0.9" />
      {/* Book pages right */}
      <path d="M52 50 Q63 48 70 52 L70 74 Q63 72 52 74 Z" fill="white" opacity="0.9" />
      {/* Sun rays above book */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 18;
        const y1 = 42 + Math.sin(rad) * 10;
        const x2 = 50 + Math.cos(rad) * 24;
        const y2 = 42 + Math.sin(rad) * 14;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="1.5" />;
      })}
      {/* Center sun circle */}
      <circle cx="50" cy="42" r="8" fill="#C9A84C" />
      <circle cx="50" cy="42" r="5" fill="#0D1B3E" />
      <circle cx="50" cy="42" r="3" fill="#C9A84C" />
      {/* Text arc "THE AMERICAN INTERNATIONAL SCHOOL" — simplified as text elements */}
      <text
        x="50" y="14"
        textAnchor="middle"
        fill="white"
        fontSize="5.5"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        letterSpacing="0.5"
      >THE AMERICAN</text>
      <text
        x="50" y="91"
        textAnchor="middle"
        fill="white"
        fontSize="4.5"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        letterSpacing="0.3"
      >DUHOK · 2018</text>
      {/* AIS text */}
      <text
        x="50" y="87"
        textAnchor="middle"
        fill="#C9A84C"
        fontSize="5"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >AIS</text>
    </svg>
  );
}

// Full wordmark: logo + "THE AMERICAN INTERNATIONAL SCHOOL"
export function AISWordmark({ logoSize = 44, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AISLogo size={logoSize} />
      <div>
        <div style={{
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: '14px',
          color: '#0D1B3E',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
        }}>THE AMERICAN</div>
        <div style={{
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: '14px',
          color: '#0D1B3E',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
        }}>INTERNATIONAL SCHOOL</div>
      </div>
    </div>
  );
}
