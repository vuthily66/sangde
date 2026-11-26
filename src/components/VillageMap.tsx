import { useEffect, useRef, useState } from 'react';
import { PLACES, PLACE_CATEGORY } from '../data/explore';

interface Props {
  activePlaceId?: string | null;
  onSelectPlace?: (id: string) => void;
  routePath?: string; // 런닝 코스
  routeColor?: string;
  highlightIds?: string[]; // 코스·투어가 지나는 곳
  progress?: number | null; // 0~1, 러너 위치
  className?: string;
}

/** 라벨이 지도 가장자리 밖으로 나가지 않도록 가로 위치를 안쪽으로 당김 */
const labelShift = (chars: number, x: number) => {
  const half = chars * 4.6 + 8;
  return Math.max(0, half - x) - Math.max(0, x + half - 400);
};

/** 상대리 마을 일러스트 지도 (viewBox 400x280) */
export default function VillageMap({ activePlaceId, onSelectPlace, routePath, routeColor = '#F97316', highlightIds = [], progress = null, className = '' }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const [runner, setRunner] = useState<{ x: number; y: number } | null>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) {
      setRunner(null);
      setStart(null);
      return;
    }
    const len = el.getTotalLength();
    const p0 = el.getPointAtLength(0);
    setStart({ x: p0.x, y: p0.y });
    if (progress === null) setRunner(null);
    else {
      const p = el.getPointAtLength(len * Math.min(1, Math.max(0, progress)));
      setRunner({ x: p.x, y: p.y });
    }
  }, [routePath, progress]);

  const dim = !!routePath || highlightIds.length > 0;

  return (
    <svg viewBox="0 0 400 280" className={`h-full w-full ${className}`} role="img" aria-label="상대리 마을 지도">
      <defs>
        <pattern id="vm-cabbage" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="#BBF7D0" />
          <circle cx="6" cy="5" r="2.6" fill="#4ADE80" />
        </pattern>
        <pattern id="vm-orchard" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#D9F99D" />
          <circle cx="7" cy="7" r="4.4" fill="#65A30D" />
          <circle cx="8.6" cy="8" r="1.4" fill="#F97316" />
        </pattern>
        <pattern id="vm-field" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <rect width="10" height="10" fill="#ECFCCB" />
          <line x1="0" y1="5" x2="10" y2="5" stroke="#D9F99D" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="400" height="280" fill="#F7FEE7" />
      {/* 밭 구획 */}
      <path d="M60 50 L160 40 L172 96 L130 132 L58 120Z" fill="url(#vm-orchard)" stroke="#334155" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <path d="M262 150 L372 140 L384 214 L330 232 L262 204Z" fill="url(#vm-cabbage)" stroke="#334155" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <path d="M230 200 L320 236 L300 270 L196 262Z" fill="url(#vm-cabbage)" stroke="#334155" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <path d="M60 160 L150 170 L160 236 L70 246Z" fill="url(#vm-field)" stroke="#334155" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <path d="M250 30 L360 24 L366 110 L266 104Z" fill="url(#vm-field)" stroke="#334155" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      {/* 길 */}
      <g fill="none" strokeLinecap="round">
        <path d="M0 160 C90 150 160 150 200 150 C260 150 330 148 400 140" stroke="#E7E5E4" strokeWidth="9" />
        <path d="M200 0 C196 60 204 110 200 150 C196 200 206 240 200 280" stroke="#E7E5E4" strokeWidth="7" />
        <path d="M200 150 C160 120 130 100 40 30" stroke="#F5F5F4" strokeWidth="5" />
        <path d="M200 150 C260 190 320 230 390 260" stroke="#F5F5F4" strokeWidth="5" />
      </g>
      {/* 마을 집들 */}
      <g>
        {[
          [182, 132], [214, 136], [190, 166], [222, 168], [176, 152], [228, 152],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect x="-6" y="-4" width="12" height="9" rx="1.5" fill="#fff" stroke="#CBD5E1" />
            <path d="M-7 -4 L0 -9 L7 -4Z" fill={i % 2 ? '#F97316' : '#1E293B'} />
          </g>
        ))}
      </g>
      {/* 바다 / 오름 힌트 */}
      <path d="M0 0 L70 0 C50 14 30 30 0 52Z" fill="#7DD3FC" opacity="0.7" />
      <path d="M340 280 C350 240 372 226 400 222 L400 280Z" fill="#86EFAC" stroke="#15803D" strokeWidth="1.5" />

      {/* 런닝 코스 */}
      {routePath && (
        <g>
          <path d={routePath} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={pathRef} d={routePath} fill="none" stroke={routeColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={routePath} fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="2 8" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
          </path>
          {start && (
            <g transform={`translate(${start.x} ${start.y})`}>
              <rect x="-15" y="-27" width="30" height="13" rx="6.5" fill="#1E293B" />
              <text y="-17.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">START</text>
            </g>
          )}
        </g>
      )}

      {/* 장소 핀 */}
      {PLACES.map((p, i) => {
        const cat = PLACE_CATEGORY[p.category];
        const active = activePlaceId === p.id;
        const faded = dim && !highlightIds.includes(p.id) && p.id !== 'hall' && !active;
        return (
          <g
            key={p.id}
            transform={`translate(${p.x} ${p.y})`}
            opacity={faded ? 0.35 : 1}
            onClick={() => onSelectPlace?.(p.id)}
            style={{ cursor: onSelectPlace ? 'pointer' : 'default' }}
          >
            {active && <circle r="16" fill={cat.color} opacity="0.2"><animate attributeName="r" values="12;18;12" dur="1.6s" repeatCount="indefinite" /></circle>}
            <circle r={active ? 10 : 8.5} fill={cat.color} stroke="#fff" strokeWidth="2.5" />
            <text y="3.2" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
              {i + 1}
            </text>
            {(active || p.category === 'nearby') && (
              <g transform={`translate(${labelShift(p.name.length, p.x)} ${p.y > 230 ? -20 : 21})`}>
                <rect x={-p.name.length * 4.6 - 6} y="-8" width={p.name.length * 9.2 + 12} height="16" rx="8" fill="#fff" stroke={cat.color} strokeWidth="1.2" />
                <text y="3.6" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
                  {p.name}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* 러너 */}
      {runner && (
        <g transform={`translate(${runner.x} ${runner.y})`}>
          <circle r="9" fill="#fff" stroke={routeColor} strokeWidth="3" />
          <text y="4" textAnchor="middle" fontSize="11">🏃</text>
        </g>
      )}

      {/* 방위 */}
      <g transform="translate(376 26)">
        <circle r="13" fill="#fff" stroke="#CBD5E1" />
        <path d="M0 -9 L4 2 L0 0 L-4 2Z" fill="#1E293B" />
        <text y="10" textAnchor="middle" fontSize="7" fontWeight="800" fill="#1E293B">N</text>
      </g>
    </svg>
  );
}
