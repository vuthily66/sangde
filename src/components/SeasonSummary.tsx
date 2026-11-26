import { CalendarClock, CalendarRange, Wheat } from 'lucide-react';
import type { ReactNode } from 'react';
import { getAge, getVariety, treeMonthly } from '../data/trees';
import { getSchedule, getTreeSchedule, ym, ymd, type TreeChoice } from '../season';
import type { FarmProduct } from '../types';
import { won } from '../utils';

/** 분양 시즌 요약 (모집 상태 · 분양 기간 · 수확 예정 · 총 분양료) */
export default function SeasonSummary({ product, from, monthlyDiscount = 0, tree }: { product: FarmProduct; from?: Date; monthlyDiscount?: number; tree?: TreeChoice }) {
  const sc = tree ? getTreeSchedule(product, tree, from, monthlyDiscount) : getSchedule(product, from, monthlyDiscount);
  const monthly = tree ? treeMonthly(tree.variety, tree.age, monthlyDiscount) : product.monthlyPrice - monthlyDiscount;
  const period = tree ? `${getAge(tree.age).years}년` : `${product.season.contractMonths}개월`;
  const isOrange = product.accent === 'orange';
  return (
    <div className="space-y-2 rounded-2xl border border-stone-200 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">{sc.seasonStart.getFullYear()} 시즌</span>
        {sc.status === 'open' ? (
          <span className="chip bg-cabbage text-white">모집 중</span>
        ) : (
          <span className="chip bg-amber-100 text-amber-800">사전 예약 · 정기 모집 {sc.recruitLabel}</span>
        )}
      </div>
      <Line icon={<CalendarRange size={15} />} label="분양 기간" value={`${ym(sc.seasonStart)} ~ ${ym(sc.contractEnd)} (${period})`} />
      <Line
        icon={<Wheat size={15} />}
        label={tree ? '첫 수확' : '수확 예정'}
        value={`${ymd(sc.harvestStart)} ~ ${ymd(sc.harvestEnd)}`}
        strong={isOrange ? 'text-tangerine' : 'text-cabbage'}
      />
      <Line icon={<CalendarClock size={15} />} label="총 분양료" value={`${won(sc.totalPrice)} (월 ${won(monthly)})`} />
      {tree && (
        <p className="pt-1 text-[11px] leading-relaxed text-stone-500">
          {getVariety(tree.variety).name} 3년생 나무 기준 첫 수확 약 {getVariety(tree.variety).firstYieldKg}kg (키우는 계획에 따라 달라져요)
        </p>
      )}
      {sc.status === 'preorder' && (
        <p className="pt-1 text-[11px] leading-relaxed text-stone-500">
          지금 신청하면 {ym(sc.seasonStart)} 시즌 자리가 먼저 배정되고, 분양료는 재배가 시작되는 달부터 청구돼요.
        </p>
      )}
    </div>
  );
}

function Line({ icon, label, value, strong }: { icon: ReactNode; label: string; value: string; strong?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-stone-400">{icon}</span>
      <span className="w-16 shrink-0 text-stone-500">{label}</span>
      <span className={`min-w-0 font-semibold tabular-nums ${strong ?? ''}`}>{value}</span>
    </div>
  );
}
