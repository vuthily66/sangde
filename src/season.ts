import { getProduct } from './data/farmProducts';
import { getAge, getVariety, treeMonthly } from './data/trees';
import type { CropSeason, FarmProduct, MyFarm, TreeAge, VarietyId } from './types';

export type SeasonStatus = 'open' | 'preorder';

export interface FarmSchedule {
  status: SeasonStatus;
  seasonStart: Date;
  contractEnd: Date;
  harvestStart: Date;
  harvestEnd: Date;
  recruitLabel: string;
  totalPrice: number;
}

const addMonths = (y: number, m0: number, offset: number) => {
  const d = new Date(y, m0 + offset, 1);
  return { y: d.getFullYear(), m0: d.getMonth() };
};

const lastDay = (y: number, m0: number) => new Date(y, m0 + 1, 0).getDate();

const at = (y: number, m0: number, offset: number, day: number) => {
  const t = addMonths(y, m0, offset);
  return new Date(t.y, t.m0, Math.min(day, lastDay(t.y, t.m0)));
};

export const monthsLabel = (months: number[]) =>
  months.length === 1 ? `${months[0]}월` : `${months[0]}~${months[months.length - 1]}월`;

/**
 * 기준일(from)에 분양을 신청했을 때 배정되는 재배 시즌.
 * 이번 해 시즌 시작월이 지났으면 다음 해 시즌으로 사전 예약됩니다.
 */
/** 시즌 시작일 기준 작업일 */
export const taskDate = (seasonStart: Date, offset: number, day: number) => at(seasonStart.getFullYear(), seasonStart.getMonth(), offset, day);

export function getSchedule(product: FarmProduct, from: Date = new Date(), monthlyDiscount = 0): FarmSchedule {
  const s: CropSeason = product.season;
  const startThisYear = new Date(from.getFullYear(), s.startMonth - 1, 1);
  // 시작월 1일 전이거나, 시작월 안이면서 모집 기간 안이면 올해 시즌
  const inStartMonthWindow = from.getMonth() === s.startMonth - 1 && s.recruitMonths.includes(s.startMonth);
  const year = from < startThisYear || inStartMonthWindow ? from.getFullYear() : from.getFullYear() + 1;
  const m0 = s.startMonth - 1;
  const month = from.getMonth() + 1;

  return {
    status: s.recruitMonths.includes(month) ? 'open' : 'preorder',
    seasonStart: new Date(year, m0, 1),
    contractEnd: at(year, m0, s.contractMonths - 1, 31),
    harvestStart: at(year, m0, s.harvestStart.offset, s.harvestStart.day),
    harvestEnd: at(year, m0, s.harvestEnd.offset, s.harvestEnd.day),
    recruitLabel: monthsLabel(s.recruitMonths),
    totalPrice: (product.monthlyPrice - monthlyDiscount) * s.contractMonths,
  };
}

export const ymd = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
export const ym = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
export const md = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

export const daysUntil = (d: Date, from: Date = new Date()) => {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((d.getTime() - a.getTime()) / 86400000);
};

/** 수확 기간 안의 토요일 체험 슬롯 (수확 시작 1주 후부터) */
export function harvestSlots(start: Date, end: Date, count = 3) {
  const slots: Date[] = [];
  const d = new Date(start);
  d.setDate(d.getDate() + 7);
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
  const holiday = (x: Date) => (x.getMonth() === 11 && x.getDate() === 25) || (x.getMonth() === 0 && x.getDate() === 1);
  while (slots.length < count && d <= end) {
    if (!holiday(d)) slots.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return slots;
}

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
export const dayLabel = (d: Date) => `${ymd(d)} (${WEEK[d.getDay()]})`;

export interface TreeChoice {
  variety?: VarietyId;
  age?: TreeAge;
}

/** 감귤·만감류 나무: 나이만큼 키운 뒤 품종별 수확 시기에 첫 수확 */
export function getTreeSchedule(product: FarmProduct, tree: TreeChoice, from: Date = new Date(), discount = 0): FarmSchedule {
  const base = getSchedule(product, from);
  const v = getVariety(tree.variety);
  const a = getAge(tree.age);
  const y0 = base.seasonStart.getFullYear();
  const m0 = base.seasonStart.getMonth();
  const yearOffset = (a.years - 1) * 12;
  const harvestStart = at(y0, m0, yearOffset + v.harvestStart.offset, v.harvestStart.day);
  const harvestEnd = at(y0, m0, yearOffset + v.harvestEnd.offset, v.harvestEnd.day);
  const plainEnd = at(y0, m0, a.years * 12 - 1, 31);
  return {
    ...base,
    contractEnd: harvestEnd > plainEnd ? harvestEnd : plainEnd,
    harvestStart,
    harvestEnd,
    totalPrice: treeMonthly(tree.variety, tree.age, discount) * a.years * 12,
  };
}

/** 분양받은 농장의 일정 (나무는 품종·나이 반영) */
export function farmSchedule(farm: MyFarm, discount = 0): FarmSchedule {
  const p = getProduct(farm.cropType);
  const from = new Date(farm.adoptedAt);
  return farm.cropType === 'tangerine'
    ? getTreeSchedule(p, { variety: farm.variety, age: farm.treeAge }, from, discount)
    : getSchedule(p, from, discount);
}
