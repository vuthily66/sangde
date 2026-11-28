export type TabId = 'rental' | 'farm' | 'market' | 'shop' | 'travel';

export type CropType = 'tangerine' | 'cabbage';

export interface FarmProduct {
  id: CropType;
  slot: string; // 구좌 A / 구좌 B
  name: string;
  emoji: string;
  monthlyPrice: number;
  expectedYield: string;
  yieldNote: string; // 수확량 기준과 배송 방식
  tagline: string; // 카드에 보이는 한 줄 소개
  description: string;
  features: string[];
  accent: 'orange' | 'green';
  season: CropSeason;
}

/** 실제 상대리 재배 달력 (월 단위) */
export interface CropPhase {
  label: string;
  months: number[]; // 1~12
  tone: 'care' | 'grow' | 'bloom' | 'ripen' | 'harvest';
}

export interface MonthDay {
  offset: number; // 분양 시작월로부터 몇 개월 뒤인지
  day: number;
}

export interface CropSeason {
  startMonth: number; // 분양(재배) 시작월
  contractMonths: number; // 분양 기간(개월)
  recruitMonths: number[]; // 모집 기간(월)
  harvestStart: MonthDay;
  harvestEnd: MonthDay;
  phases: CropPhase[];
  stageSeasons: Record<GrowthStageId, string>; // 가상 성장 단계 ↔ 실제 시기
  why: string; // 이 시기를 고른 이유
}

export interface MyFarm {
  id: string;
  cropType: CropType;
  nickname: string;
  growth: number; // 0 ~ 100
  adoptedAt: string; // ISO
  harvested: boolean;
  actionCount: number;
  careMode?: CareMode; // 없으면 'farmer' (이전 저장 데이터 호환)
  variety?: VarietyId; // 나무 품종 (감귤 나무만)
  treeAge?: TreeAge; // 분양받을 때 나무 나이
  plan?: TreePlan; // 연차·계절별 비료·물 계획
  planResult?: PlanResult; // 시뮬레이션 결과
  log?: LogEntry[];
}

/** 직접 키우기 / 상대리 농부 위탁 재배 */
export type CareMode = 'self' | 'farmer';

export interface CareModeOption {
  id: CareMode;
  title: string;
  summary: string;
  points: string[];
  monthlyDiscount: number;
}

export interface Farmer {
  name: string;
  career: string;
  plot: string; // 담당 구좌 번지
  greeting: string;
}

/** 시즌 중 실제 밭에서 하는 작업 */
export interface CultivationTask {
  id: string;
  title: string;
  offset: number; // 시즌 시작월로부터 개월
  day: number;
  detail: string; // 농부가 남기는 작업 기록
  metric?: string; // 측정값
  selfJoin: boolean; // 직접 키우기 고객이 참여하는 작업
  stage: GrowthStageId; // 현장 사진 장면
}

export interface LogComment {
  by: 'me' | 'farmer';
  text: string;
  at: string;
}

export interface LogEntry {
  taskId: string;
  by: 'farmer' | 'me';
  at: string; // 작업일 (시뮬레이션)
  note: string;
  photo?: string; // 직접 올린 사진 (data URL)
  checked: boolean; // 구매자 확인 여부
  comments: LogComment[];
}

export type CareActionId = 'water' | 'sun' | 'nutrient';

export interface CareAction {
  id: CareActionId;
  label: string;
  emoji: string;
  boost: [number, number]; // min, max 성장률 증가
  messages: string[];
}

export type GrowthStageId = 'seed' | 'growing' | 'almost' | 'ready';

export interface GrowthStage {
  id: GrowthStageId;
  label: string;
  min: number;
  description: string;
}

export interface MealKit {
  id: string;
  name: string;
  emoji: string;
  price: number;
  ingredients: string[];
  localCrop: CropType;
  servings: string;
  cookTime: string;
  tag: string;
}

export type PackageId = 'basic' | 'family';

export interface PackageOption {
  id: PackageId;
  name: string;
  price: number;
  description: string;
  contents: string[];
}

export interface StampMission {
  id: string;
  title: string;
  emoji: string;
  location: string;
  description: string;
}

export interface VisitBenefit {
  id: string;
  title: string;
  description: string;
  emoji: string;
  cta: string;
  kind: 'reservation' | 'coupon';
}

export type Cart = Record<string, number>;

export interface AppState {
  farms: MyFarm[];
  selectedFarmId: string | null;
  cart: Cart;
  packageId: PackageId | null;
  stamps: string[];
  reservedBenefits: string[];
  certificateIssuedAt: string | null;
  runs: RunRecord[];
  stampPhotos?: Record<string, string>; // 미션별 인증샷 (data URL)
  residentPhoto?: string | null; // 명예 주민증 사진
}

/** 마을 탐방 */
export type PlaceCategory = 'village' | 'farm' | 'cafe' | 'walk' | 'nearby';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  x: number; // 지도 좌표 (viewBox 400x280)
  y: number;
  summary: string;
  stay: string; // 추천 머무는 시간
  access: string; // 마을회관 기준 이동
  kakaoQuery?: string; // 실제 장소일 때 카카오맵 검색어
  tip?: string;
}

export interface TourOption {
  id: string;
  title: string;
  duration: string;
  price: number; // 1인
  memberPrice: number; // 분양 고객 1인
  summary: string;
  route: string[]; // place ids
}

export type RunLevel = '초급' | '중급' | '상급';

export interface RunCourse {
  id: string;
  name: string;
  level: RunLevel;
  distanceKm: number;
  gainM: number; // 누적 상승
  path: string; // SVG path (viewBox 400x280)
  elevation: number[]; // 출발점 대비 상대 고도(m), 같은 간격
  surface: string;
  bestTime: string;
  highlights: string[]; // 지나가는 명소 id
  water: string;
  caution: string;
}

export interface RunRecord {
  courseId: string;
  seconds: number;
  paceSec: number; // km당 초
  at: string;
}

/** 감귤·만감류 나무 키우기 */
export type VarietyId = 'gamgyul' | 'hallabong' | 'cheonhyehyang' | 'redhyang';
export type TreeAge = 1 | 2 | 3;
export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';
export type FertId = 'none' | 'compost' | 'liquid' | 'slow' | 'microbe';
export type WaterId = 'low' | 'mid' | 'high';

export interface SeasonChoice {
  fert: FertId;
  water: WaterId;
}

/** key: `${연차}-${계절}` 예) '1-spring' */
export type TreePlan = Record<string, SeasonChoice>;

export interface PlanResult {
  health: number; // 0~100
  brix: number;
  yieldKg: number;
  grade: 'S' | 'A' | 'B' | 'C';
  at: string;
}
