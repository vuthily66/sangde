/** 상대리 마을 농장 원형 배지 */
export default function VillageBadge({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="상대리 마을 농장">
      <circle cx="50" cy="50" r="47" fill="#F97316" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
      <circle cx="50" cy="50" r="36" fill="#FFF7ED" />
      <text x="50" y="47" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1E293B">상대리</text>
      <text x="50" y="65" textAnchor="middle" fontSize="13" fontWeight="800" fill="#16A34A">마을농장</text>
      <path id="vb-arc" d="M14 50 A36 36 0 0 1 86 50" fill="none" />
    </svg>
  );
}
