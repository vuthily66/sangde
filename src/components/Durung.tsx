interface DurungProps {
  size?: number;
  mood?: 'happy' | 'excited' | 'wink';
  className?: string;
}

/** 상대리 마을 가이드 마스코트 '두룽' — 감귤 몸통 + 양배추 잎 모자 */
export default function Durung({ size = 96, mood = 'happy', className = '' }: DurungProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="상대리 마을 가이드 두룽"
    >
      {/* 그림자 */}
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="#1E293B" opacity="0.12" />
      {/* 팔 */}
      <path d="M22 72 Q10 66 12 56" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M98 72 Q110 64 106 54" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* 감귤 몸통 */}
      <circle cx="60" cy="70" r="40" fill="#F97316" />
      <circle cx="60" cy="70" r="40" fill="url(#durung-shine)" />
      {/* 감귤 껍질 점 */}
      <g fill="#EA580C" opacity="0.45">
        <circle cx="32" cy="62" r="1.6" />
        <circle cx="38" cy="90" r="1.6" />
        <circle cx="86" cy="88" r="1.6" />
        <circle cx="90" cy="60" r="1.6" />
        <circle cx="70" cy="100" r="1.4" />
      </g>
      {/* 양배추 잎 모자 */}
      <path d="M26 46 Q30 18 60 20 Q90 18 94 46 Q78 36 60 40 Q42 36 26 46Z" fill="#16A34A" />
      <path d="M34 42 Q40 26 60 26 Q80 26 86 42 Q72 34 60 36 Q48 34 34 42Z" fill="#4ADE80" />
      <path d="M60 22 L60 38 M48 28 Q52 34 54 38 M72 28 Q68 34 66 38" stroke="#15803D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* 꼭지 잎 */}
      <path d="M60 20 Q66 6 80 8 Q74 20 60 20Z" fill="#22C55E" />
      {/* 눈 */}
      {mood === 'excited' ? (
        <g stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M42 66 Q47 60 52 66" />
          <path d="M68 66 Q73 60 78 66" />
        </g>
      ) : mood === 'wink' ? (
        <g>
          <circle cx="47" cy="66" r="5" fill="#1E293B" />
          <circle cx="48.6" cy="64.4" r="1.6" fill="#fff" />
          <path d="M68 66 Q73 61 78 66" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="47" cy="66" r="5" fill="#1E293B" />
          <circle cx="73" cy="66" r="5" fill="#1E293B" />
          <circle cx="48.6" cy="64.4" r="1.6" fill="#fff" />
          <circle cx="74.6" cy="64.4" r="1.6" fill="#fff" />
        </g>
      )}
      {/* 볼터치 */}
      <ellipse cx="37" cy="77" rx="6" ry="3.6" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="83" cy="77" rx="6" ry="3.6" fill="#FDA4AF" opacity="0.8" />
      {/* 입 */}
      {mood === 'excited' ? (
        <path d="M51 77 Q60 90 69 77Z" fill="#9F1239" />
      ) : (
        <path d="M52 78 Q60 85 68 78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      <defs>
        <radialGradient id="durung-shine" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
