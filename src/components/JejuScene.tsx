/** 히어로 배경: 한라산 · 양배추 들녘 · 감귤밭 · 현무암 밭담 */
export default function JejuScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="js-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BAE6FD" />
          <stop offset="0.55" stopColor="#E0F2FE" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
        <linearGradient id="js-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DA3B8" />
          <stop offset="1" stopColor="#A7C4C9" />
        </linearGradient>
        <linearGradient id="js-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86EFAC" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="js-field2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4ADE80" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id="js-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF7D6" />
          <stop offset="0.45" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="520" fill="url(#js-sky)" />
      <circle cx="980" cy="110" r="120" fill="url(#js-sun)" />
      {/* 구름 */}
      <g fill="#fff" opacity="0.85">
        <ellipse cx="220" cy="90" rx="70" ry="18" />
        <ellipse cx="260" cy="78" rx="40" ry="20" />
        <ellipse cx="720" cy="60" rx="56" ry="14" />
        <ellipse cx="750" cy="50" rx="30" ry="14" />
      </g>
      {/* 한라산 */}
      <path d="M0 300 C180 290 330 250 470 200 C540 176 580 160 610 160 C640 160 690 178 760 204 C900 254 1040 286 1200 292 L1200 360 L0 360Z" fill="url(#js-mtn)" />
      <path d="M560 172 C590 158 630 158 662 172 C640 168 620 170 600 176Z" fill="#E2ECEF" opacity="0.8" />
      {/* 먼 들판 */}
      <path d="M0 330 C200 310 420 318 620 330 C820 342 1020 320 1200 316 L1200 400 L0 400Z" fill="url(#js-field)" />
      {/* 감귤밭 나무 줄 */}
      <g>
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 40 + i * 74;
          const y = 336 + (i % 2) * 6;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="22" fill="#15803D" />
              <circle cx={x - 8} cy={y - 6} r="12" fill="#16A34A" />
              <circle cx={x + 7} cy={y + 2} r="3.6" fill="#F97316" />
              <circle cx={x - 9} cy={y + 6} r="3.2" fill="#FB923C" />
              <circle cx={x + 2} cy={y - 10} r="3" fill="#F97316" />
            </g>
          );
        })}
      </g>
      {/* 가까운 양배추 들녘 (이랑) */}
      <path d="M0 380 C260 364 560 372 820 382 C980 388 1100 384 1200 378 L1200 520 L0 520Z" fill="url(#js-field2)" />
      <g stroke="#166534" strokeOpacity="0.35" strokeWidth="3" fill="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M0 ${398 + i * 20} C300 ${386 + i * 20} 700 ${394 + i * 21} 1200 ${392 + i * 20}`} />
        ))}
      </g>
      <g>
        {Array.from({ length: 5 }).flatMap((_, row) =>
          Array.from({ length: 16 }).map((__, i) => {
            const x = 30 + i * 76 + (row % 2) * 28;
            const y = 404 + row * 20;
            const r = 6 + row * 1.4;
            return (
              <g key={`${row}-${i}`}>
                <circle cx={x} cy={y} r={r} fill="#BBF7D0" opacity="0.75" />
                <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill="#F0FDF4" opacity="0.5" />
              </g>
            );
          }),
        )}
      </g>
      {/* 현무암 밭담 */}
      <g>
        {Array.from({ length: 34 }).map((_, i) => (
          <ellipse key={i} cx={i * 37 + 10} cy={502 - (i % 3) * 3} rx={22 + (i % 4) * 2} ry={14 + (i % 2) * 3} fill={['#1E293B', '#334155', '#273449'][i % 3]} />
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={`h${i}`} cx={i * 41 + 18} cy={498 - (i % 2) * 4} r="1.8" fill="#0F172A" opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}
