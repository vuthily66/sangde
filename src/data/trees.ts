import type { FertId, SeasonChoice, SeasonId, TreeAge, TreePlan, VarietyId, WaterId } from '../types';

// 가격·수확량·당도는 시연용 예시입니다. 실제 운영 전 농가와 함께 정해 주세요.

export interface Variety {
  id: VarietyId;
  name: string;
  group: '감귤' | '만감류';
  harvest: string; // 수확 시기 표시
  harvestStart: { offset: number; day: number }; // 3월 시작 기준 개월 수
  harvestEnd: { offset: number; day: number };
  priceAdd: number; // 월 분양료 추가
  brixBase: number; // 보통 당도
  firstYieldKg: number; // 3년생 나무 첫 수확 기준
  taste: string;
}

export const VARIETIES: Variety[] = [
  {
    id: 'gamgyul',
    name: '감귤',
    group: '감귤',
    harvest: '11~12월',
    harvestStart: { offset: 8, day: 10 },
    harvestEnd: { offset: 9, day: 31 },
    priceAdd: 0,
    brixBase: 11,
    firstYieldKg: 8,
    taste: '새콤달콤한 노지 감귤',
  },
  {
    id: 'hallabong',
    name: '한라봉',
    group: '만감류',
    harvest: '1~3월',
    harvestStart: { offset: 10, day: 20 },
    harvestEnd: { offset: 12, day: 31 },
    priceAdd: 6000,
    brixBase: 13,
    firstYieldKg: 5,
    taste: '꼭지가 볼록, 진하고 단 맛',
  },
  {
    id: 'cheonhyehyang',
    name: '천혜향',
    group: '만감류',
    harvest: '2~3월',
    harvestStart: { offset: 11, day: 1 },
    harvestEnd: { offset: 12, day: 31 },
    priceAdd: 6000,
    brixBase: 12.5,
    firstYieldKg: 5,
    taste: '껍질이 얇고 향이 좋은 과즙',
  },
  {
    id: 'redhyang',
    name: '레드향',
    group: '만감류',
    harvest: '12~1월',
    harvestStart: { offset: 9, day: 10 },
    harvestEnd: { offset: 10, day: 31 },
    priceAdd: 7000,
    brixBase: 13,
    firstYieldKg: 5,
    taste: '붉은 빛 껍질, 탱글한 과육',
  },
];

export const getVariety = (id?: VarietyId) => VARIETIES.find((v) => v.id === (id ?? 'gamgyul'))!;

export interface AgeOption {
  age: TreeAge;
  label: string;
  years: number; // 키우는 기간(년)
  monthly: number;
  summary: string;
}

/** 1년차 어린나무는 바로 수확이 어려워요. 3년생이 되는 해부터 첫 수확 */
export const AGE_OPTIONS: AgeOption[] = [
  { age: 1, label: '1년차 묘목', years: 3, monthly: 12000, summary: '묘목부터 3년. 3년째 겨울 첫 수확' },
  { age: 2, label: '2년차 나무', years: 2, monthly: 17000, summary: '2년 키우고 2년째 겨울 첫 수확' },
  { age: 3, label: '3년차 나무', years: 1, monthly: 26000, summary: '올해 바로 수확할 수 있어요' },
];

export const getAge = (age?: TreeAge) => AGE_OPTIONS.find((a) => a.age === (age ?? 3))!;

export const treeMonthly = (variety: VarietyId | undefined, age: TreeAge | undefined, discount = 0) =>
  getAge(age).monthly + getVariety(variety).priceAdd - discount;

/* ───── 키우기 계획 게임 ───── */

export const SEASONS: { id: SeasonId; label: string; months: string; tip: string }[] = [
  { id: 'spring', label: '봄', months: '3~5월', tip: '새순과 꽃이 나와요. 밑거름이 중요해요.' },
  { id: 'summer', label: '여름', months: '6~8월', tip: '열매가 커져요. 물이 많이 필요해요.' },
  { id: 'autumn', label: '가을', months: '9~11월', tip: '색이 들고 단맛이 올라요. 물과 비료를 줄여요.' },
  { id: 'winter', label: '겨울', months: '12~2월', tip: '나무가 쉬며 회복해요. 퇴비로 기운을 채워요.' },
];

export const FERTS: { id: FertId; label: string; short: string; desc: string }[] = [
  { id: 'none', label: '주지 않기', short: '없음', desc: '비료 없이 지켜봐요' },
  { id: 'compost', label: '유기질 퇴비', short: '퇴비', desc: '마을 퇴비장에서 숙성한 퇴비. 흙을 건강하게' },
  { id: 'liquid', label: '액비(물비료)', short: '액비', desc: '물에 타서 주는 비료. 빠르게 효과' },
  { id: 'slow', label: '완효성 비료', short: '완효성', desc: '천천히 오래 녹는 알갱이 비료' },
  { id: 'microbe', label: '친환경 미생물제', short: '미생물', desc: '뿌리 주변 흙 속 미생물을 늘려요' },
];

export const WATERS: { id: WaterId; label: string; drops: number }[] = [
  { id: 'low', label: '적게', drops: 1 },
  { id: 'mid', label: '보통', drops: 2 },
  { id: 'high', label: '많이', drops: 3 },
];

export const DEFAULT_CHOICE: SeasonChoice = { fert: 'none', water: 'mid' };

/** 연차·계절별 날씨 (계획을 세울 때 참고하는 예보) */
const WEATHER: Record<string, { label: string; effect: 'rain' | 'dry' | 'typhoon' | 'cold' }> = {
  '1-summer': { label: '긴 장마', effect: 'rain' },
  '1-autumn': { label: '가을 가뭄', effect: 'dry' },
  '2-summer': { label: '태풍 예보', effect: 'typhoon' },
  '2-winter': { label: '한파', effect: 'cold' },
  '3-summer': { label: '무더위·가뭄', effect: 'dry' },
  '3-autumn': { label: '잦은 가을비', effect: 'rain' },
};

export const weatherOf = (year: number, season: SeasonId) => WEATHER[`${year}-${season}`];

export const planKey = (year: number, season: SeasonId) => `${year}-${season}`;

export interface SeasonOutcome {
  health: number; // 나무 건강 변화
  brix: number; // 당도 변화 (수확하는 해 가을에만 의미)
  yieldPct: number; // 수확량 변화(%)
  mood: 'good' | 'ok' | 'bad';
  note: string;
}

const FERT_FIT: Record<SeasonId, Partial<Record<FertId, number>>> = {
  spring: { compost: 6, slow: 6, microbe: 3, liquid: 2, none: -4 },
  summer: { liquid: 5, microbe: 4, compost: 1, slow: 1, none: -3 },
  autumn: { none: 2, microbe: 3, compost: -1, liquid: -4, slow: -5 },
  winter: { compost: 6, microbe: 3, slow: 0, liquid: -2, none: -2 },
};

const WATER_FIT: Record<SeasonId, Record<WaterId, number>> = {
  spring: { low: -2, mid: 3, high: 0 },
  summer: { low: -5, mid: 2, high: 4 },
  autumn: { low: 2, mid: 1, high: -3 },
  winter: { low: 2, mid: 1, high: -3 },
};

/** 한 계절의 선택이 나무에 주는 영향 */
export function evaluateSeason(year: number, season: SeasonId, c: SeasonChoice): SeasonOutcome {
  let health = (FERT_FIT[season][c.fert] ?? 0) + WATER_FIT[season][c.water];
  let brix = 0;
  let yieldPct = 0;
  const notes: string[] = [];
  let hurt = false; // 날씨 피해가 있었는지
  const w = weatherOf(year, season);

  if (w?.effect === 'rain' && c.water === 'high') {
    health -= 5;
    hurt = true;
    notes.push(`${w.label}에 물까지 많이 줘서 뿌리가 힘들어요`);
  }
  if (w?.effect === 'dry' && c.water === 'low') {
    health -= 5;
    hurt = true;
    notes.push(`${w.label}인데 물이 부족했어요`);
  }
  if (w?.effect === 'dry' && c.water === 'high') {
    health += 2;
    notes.push(`${w.label}을 물로 잘 버텼어요`);
  }
  if (w?.effect === 'typhoon' && (c.fert === 'compost' || c.fert === 'microbe')) {
    health += 2;
    notes.push('튼튼한 뿌리 덕분에 태풍을 잘 견뎠어요');
  } else if (w?.effect === 'typhoon') {
    health -= 3;
    hurt = true;
    notes.push('태풍에 가지가 조금 상했어요 (퇴비·미생물제로 뿌리를 튼튼히 하면 견뎌요)');
  }
  if (w?.effect === 'cold' && c.fert === 'compost') {
    health += 2;
    notes.push('퇴비가 한파 속 뿌리를 지켜줬어요');
  }

  if (season === 'summer') yieldPct += c.water === 'high' ? 8 : c.water === 'low' ? -12 : 2;
  if (season === 'autumn') {
    brix += c.water === 'low' ? 1.2 : c.water === 'high' ? -1 : 0.3;
    if (c.fert === 'slow' || c.fert === 'liquid') {
      brix -= 0.8;
      hurt = true;
      notes.push('가을 비료가 많아 단맛이 덜 올라요');
    }
    if (c.water === 'low') notes.push('가을에 물을 줄여 당도가 올라가요');
  }
  if (!notes.length) {
    notes.push(health >= 6 ? '딱 좋은 선택이에요' : health >= 1 ? '무난한 선택이에요' : '이 계절엔 맞지 않는 선택이에요');
  }
  return { health, brix, yieldPct, mood: health < 0 ? 'bad' : hurt ? 'ok' : health >= 5 ? 'good' : 'ok', note: notes.join(' · ') };
}

/** 전체 계획 결과 */
export function simulatePlan(plan: TreePlan, years: number, variety: VarietyId | undefined) {
  const v = getVariety(variety);
  let health = 60;
  let brix = v.brixBase;
  let yieldPct = 0;
  const steps: { year: number; season: SeasonId; outcome: SeasonOutcome; healthAfter: number }[] = [];
  for (let y = 1; y <= years; y++) {
    for (const s of SEASONS) {
      const o = evaluateSeason(y, s.id, plan[planKey(y, s.id)] ?? DEFAULT_CHOICE);
      health = Math.max(0, Math.min(100, health + o.health));
      if (y === years) {
        brix += o.brix;
        yieldPct += o.yieldPct;
      }
      steps.push({ year: y, season: s.id, outcome: o, healthAfter: health });
    }
  }
  const yieldKg = Math.max(1, Math.round(v.firstYieldKg * (0.5 + health / 100) * (1 + yieldPct / 100) * 10) / 10);
  brix = Math.round(Math.max(8, Math.min(16, brix + (health - 60) / 40)) * 10) / 10;
  const score = health + (brix - v.brixBase) * 10;
  const grade: 'S' | 'A' | 'B' | 'C' = score >= 95 ? 'S' : score >= 80 ? 'A' : score >= 60 ? 'B' : 'C';
  return { health: Math.round(health), brix, yieldKg, grade, steps };
}

/** 농부님 추천 계획 */
export function recommendedPlan(years: number): TreePlan {
  const best: Record<SeasonId, SeasonChoice> = {
    spring: { fert: 'compost', water: 'mid' },
    summer: { fert: 'liquid', water: 'high' },
    autumn: { fert: 'microbe', water: 'low' },
    winter: { fert: 'compost', water: 'low' },
  };
  const plan: TreePlan = {};
  for (let y = 1; y <= years; y++) {
    for (const s of SEASONS) {
      const c = { ...best[s.id] };
      const w = weatherOf(y, s.id);
      if (w?.effect === 'rain') c.water = 'mid';
      if (w?.effect === 'dry') c.water = 'high';
      if (w?.effect === 'typhoon') c.fert = 'microbe';
      plan[planKey(y, s.id)] = c;
    }
  }
  return plan;
}
