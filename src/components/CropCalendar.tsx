import type { CropPhase, FarmProduct } from '../types';

const TONE: Record<CropPhase['tone'], string> = {
  care: 'bg-stone-300',
  grow: 'bg-green-400',
  bloom: 'bg-pink-300',
  ripen: 'bg-amber-400',
  harvest: 'bg-tangerine',
};

interface Props {
  product: FarmProduct;
  compact?: boolean;
  today?: Date;
}

/** 분양 기간 동안의 실제 상대리 재배 달력 */
export default function CropCalendar({ product, compact = false, today = new Date() }: Props) {
  const { startMonth, contractMonths, phases } = product.season;
  const months = Array.from({ length: contractMonths }, (_, i) => ((startMonth - 1 + i) % 12) + 1);
  const nowMonth = today.getMonth() + 1;
  const phaseOf = (m: number) => phases.find((p) => p.months.includes(m))!;

  // 연속된 같은 단계끼리 묶어 라벨 표시
  const groups: { phase: CropPhase; span: number }[] = [];
  months.forEach((m) => {
    const p = phaseOf(m);
    const last = groups[groups.length - 1];
    if (last && last.phase === p) last.span += 1;
    else groups.push({ phase: p, span: 1 });
  });

  return (
    <div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${contractMonths}, minmax(0, 1fr))` }}>
        {months.map((m) => {
          const isNow = m === nowMonth;
          return (
            <div key={m} className="relative flex flex-col items-center">
              <span className={`text-[10px] font-bold tabular-nums ${isNow ? 'text-basalt' : 'text-stone-400'}`}>{m}월</span>
              <div className={`mt-1 h-2.5 w-full ${TONE[phaseOf(m).tone]} ${m === months[0] ? 'rounded-l-full' : ''} ${m === months[months.length - 1] ? 'rounded-r-full' : ''}`} />
              {isNow && (
                <span className="absolute -bottom-4 whitespace-nowrap text-[9px] font-black text-basalt">▲ 지금</span>
              )}
            </div>
          );
        })}
      </div>
      {!compact && (
        <div className="mt-5 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${contractMonths}, minmax(0, 1fr))` }}>
          {groups.map((g, i) => (
            <div key={i} style={{ gridColumn: `span ${g.span}` }} className="min-w-0 text-center">
              <span className={`block truncate text-[11px] font-semibold ${g.phase.tone === 'harvest' ? 'text-tangerine' : 'text-stone-500'}`}>
                {g.phase.label}
              </span>
            </div>
          ))}
        </div>
      )}
      {compact && (
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
          {phases.map((p) => (
            <span key={p.label} className="flex items-center gap-1 text-[11px] text-stone-500">
              <span className={`h-2 w-2 rounded-full ${TONE[p.tone]}`} /> {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
