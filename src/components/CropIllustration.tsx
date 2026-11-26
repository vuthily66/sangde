import type { CropType, GrowthStageId } from '../types';
import { CROP_IMAGES } from './CropImage';

interface Props {
  crop: CropType;
  stage: GrowthStageId;
  growth: number;
  cover?: boolean; // 영역을 꽉 채우기 (잘림 허용)
}

/** 성장 단계별 작물 일러스트 (SVG) */
export default function CropIllustration({ crop, stage, growth, cover = false }: Props) {
  const sky = stage === 'ready' ? ['#FEF3C7', '#FFEDD5'] : ['#E0F2FE', '#F0FDF4'];
  return (
    <svg viewBox="0 0 300 220" preserveAspectRatio={cover ? 'xMidYMax slice' : 'xMidYMid meet'} className="h-full w-full" role="img" aria-label={`${crop} ${stage}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="220" fill="url(#sky)" />
      {/* 해 */}
      <circle cx="252" cy="40" r="18" fill="#FDE047" opacity="0.9" />
      {/* 한라산 실루엣 */}
      <path d="M0 150 Q90 95 150 110 Q210 92 300 140 L300 170 L0 170Z" fill="#BBF7D0" opacity="0.7" />
      {/* 현무암 돌담 */}
      <g fill="#334155">
        {Array.from({ length: 11 }).map((_, i) => (
          <ellipse key={i} cx={i * 30 + 10} cy={163} rx={16} ry={9} opacity={0.85 - (i % 3) * 0.1} />
        ))}
      </g>
      {/* 흙 */}
      <rect y="168" width="300" height="52" fill="#78350F" />
      <path d="M0 172 Q75 166 150 172 T300 172 L300 220 L0 220Z" fill="#92400E" />
      <g fill="#451A03" opacity="0.4">
        <circle cx="40" cy="195" r="2" /><circle cx="110" cy="205" r="2" /><circle cx="200" cy="190" r="2" /><circle cx="260" cy="208" r="2" />
      </g>

      <g transform="translate(150 172)">{crop === 'tangerine' ? <Tangerine stage={stage} growth={growth} /> : <Cabbage stage={stage} growth={growth} />}</g>
    </svg>
  );
}

function Sprout() {
  return (
    <g>
      <path d="M0 0 Q-2 -20 0 -34" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M0 -26 Q-22 -38 -26 -22 Q-12 -16 0 -26Z" fill="#22C55E" />
      <path d="M0 -32 Q20 -48 26 -30 Q12 -24 0 -32Z" fill="#4ADE80" />
    </g>
  );
}

function Tangerine({ stage, growth }: { stage: GrowthStageId; growth: number }) {
  if (stage === 'seed') return <g transform={`scale(${0.9 + growth / 80})`}><Sprout /></g>;
  const s = stage === 'growing' ? 0.65 + (growth - 35) / 160 : 1;
  const fruitColor = stage === 'almost' ? (growth > 88 ? '#FB923C' : '#A3E635') : '#F97316';
  const fruits: [number, number][] = [[-38, -88], [30, -100], [-10, -120], [44, -70], [-52, -60], [8, -76], [-28, -108], [55, -105]];
  return (
    <g transform={`scale(${s})`} className="origin-bottom">
      <path d="M-6 0 L-4 -60 Q0 -70 4 -60 L6 0Z" fill="#78350F" />
      <path d="M0 -50 L-24 -70 M2 -56 L22 -78" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="-96" r="52" fill="#15803D" />
      <circle cx="-30" cy="-80" r="34" fill="#16A34A" />
      <circle cx="32" cy="-82" r="34" fill="#16A34A" />
      <circle cx="4" cy="-118" r="30" fill="#22C55E" />
      {stage === 'growing' &&
        fruits.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="0" cy="-4" rx="3" ry="5" fill="#fff" transform={`rotate(${r})`} />
            ))}
            <circle r="2.2" fill="#FDE047" />
          </g>
        ))}
      {stage === 'almost' &&
        fruits.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="8" fill={fruitColor} />
            <circle cx={x - 3} cy={y - 3} r="2.5" fill="#fff" opacity="0.5" />
          </g>
        ))}
      {stage === 'ready' &&
        fruits.map(([x, y], i) => <image key={i} href={CROP_IMAGES.tangerine} x={x - 14} y={y - 14} width="28" height="28" />)}
      {stage === 'ready' && <Sparkles />}
    </g>
  );
}

function Cabbage({ stage, growth }: { stage: GrowthStageId; growth: number }) {
  if (stage === 'seed') return <g transform={`scale(${0.9 + growth / 80})`}><Sprout /></g>;
  const s = stage === 'growing' ? 0.7 + (growth - 35) / 150 : 1;
  const head = stage === 'growing' ? 0 : stage === 'almost' ? 26 : 36;
  return (
    <g transform={`scale(${s})`}>
      {/* 바깥 잎 */}
      <path d="M0 -10 Q-80 -20 -70 -70 Q-30 -60 0 -20Z" fill="#15803D" />
      <path d="M0 -10 Q80 -20 70 -70 Q30 -60 0 -20Z" fill="#15803D" />
      <path d="M0 -6 Q-60 10 -86 -24 Q-40 -34 0 -14Z" fill="#16A34A" />
      <path d="M0 -6 Q60 10 86 -24 Q40 -34 0 -14Z" fill="#16A34A" />
      <path d="M-40 -40 L-10 -18 M40 -40 L10 -18" stroke="#BBF7D0" strokeWidth="2" opacity="0.7" />
      {head > 0 ? (
        <image href={CROP_IMAGES.cabbage} x={-head * 1.45} y={-head * 2.6} width={head * 2.9} height={head * 2.9} />
      ) : null}
      {head === 0 && (
        <g>
          <path d="M0 -10 Q-30 -70 0 -80 Q30 -70 0 -10Z" fill="#22C55E" />
          <path d="M0 -14 L0 -72" stroke="#BBF7D0" strokeWidth="2" />
          <path d="M0 -12 Q-40 -50 -30 -64 Q-10 -50 0 -14Z" fill="#4ADE80" />
          <path d="M0 -12 Q40 -50 30 -64 Q10 -50 0 -14Z" fill="#4ADE80" />
        </g>
      )}
      {stage === 'ready' && <Sparkles />}
    </g>
  );
}

function Sparkles() {
  return (
    <g fill="#FACC15">
      {[[-80, -140], [80, -130], [-60, -30], [90, -40], [0, -170]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2}Z`}>
          <animate attributeName="opacity" values="1;0.2;1" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
    </g>
  );
}
