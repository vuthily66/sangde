import type { Place, RunCourse, TourOption } from '../types';

// 지도·거리·고도는 시연용 예시입니다. 실제 운영 전 마을과 함께 실측해 바꿔 주세요.
export const PLACES: Place[] = [
  {
    id: 'hall',
    name: '상대리 마을회관',
    category: 'village',
    x: 200,
    y: 150,
    summary: '탐방과 런닝의 출발점. 화장실과 물, 짐 보관을 이용할 수 있어요.',
    stay: '10분',
    access: '출발점',
  },
  {
    id: 'tree',
    name: '팽나무 쉼터',
    category: 'village',
    x: 166,
    y: 116,
    summary: '마을 어르신들이 모이는 큰 팽나무 그늘. 마을 이야기를 듣기 좋은 곳이에요.',
    stay: '15분',
    access: '도보 5분',
    tip: '여름 한낮에는 여기서 쉬어 가세요.',
  },
  {
    id: 'cafe',
    name: '감귤 창고 카페',
    category: 'cafe',
    x: 238,
    y: 124,
    summary: '오래된 돌창고를 고친 마을 카페. 분양 고객 음료 쿠폰을 쓸 수 있어요.',
    stay: '40분',
    access: '도보 7분',
    tip: '감귤 에이드와 귤 껍질 차가 인기예요.',
  },
  {
    id: 'orchard',
    name: '감귤원 A구역',
    category: 'farm',
    x: 108,
    y: 90,
    summary: '분양 감귤 나무가 모여 있는 곳. 내 나무 이름표를 직접 찾아보세요.',
    stay: '30분',
    access: '도보 12분',
    tip: '11~12월에는 수확 체험이 열려요.',
  },
  {
    id: 'stonewall',
    name: '밭담길',
    category: 'walk',
    x: 118,
    y: 192,
    summary: '현무암을 쌓아 만든 밭담 사이로 난 1.2km 산책길. 바람 소리가 좋아요.',
    stay: '30분',
    access: '도보 10분',
  },
  {
    id: 'cabbage',
    name: '양배추밭 B구역',
    category: 'farm',
    x: 322,
    y: 178,
    summary: '겨울이면 초록 양배추가 끝없이 줄지어 서는 들녘. 분양 양배추 이랑이 있어요.',
    stay: '20분',
    access: '도보 15분',
    tip: '12~2월이 가장 예뻐요.',
  },
  {
    id: 'photo',
    name: '양배추 밭 포토존',
    category: 'farm',
    x: 288,
    y: 214,
    summary: '들녘 한가운데 놓인 나무 액자 포토존. 해 질 무렵 역광 사진이 잘 나와요.',
    stay: '15분',
    access: '도보 18분',
  },
  {
    id: 'hyeopjae',
    name: '협재 해변 · 한림공원',
    category: 'nearby',
    x: 24,
    y: 28,
    summary: '에메랄드빛 바다와 비양도가 보이는 서쪽 해안. 탐방 뒤 들르기 좋아요.',
    stay: '2시간',
    access: '인근 · 차로 이동',
    kakaoQuery: '협재해수욕장',
  },
  {
    id: 'oreum',
    name: '금오름',
    category: 'nearby',
    x: 378,
    y: 252,
    summary: '분화구 습지가 있는 오름. 정상에서 한림 들녘과 바다가 한눈에 보여요.',
    stay: '1시간 30분',
    access: '인근 · 차로 이동',
    kakaoQuery: '금오름',
  },
];

/** 카카오맵 검색 링크 (새 탭에서 실제 지도가 열림) */
export const VILLAGE_QUERY = '제주 한림읍 상대리';
export const kakaoSearchUrl = (q: string) => `https://map.kakao.com/link/search/${encodeURIComponent(q)}`;

export const PLACE_CATEGORY: Record<Place['category'], { label: string; color: string; chip: string }> = {
  village: { label: '마을', color: '#1E293B', chip: 'bg-slate-100 text-slate-700' },
  farm: { label: '농장', color: '#16A34A', chip: 'bg-green-100 text-green-800' },
  cafe: { label: '카페', color: '#F97316', chip: 'bg-orange-100 text-orange-800' },
  walk: { label: '산책', color: '#0EA5E9', chip: 'bg-sky-100 text-sky-800' },
  nearby: { label: '인근 명소', color: '#7C3AED', chip: 'bg-violet-100 text-violet-800' },
};

export const TOUR_OPTIONS: TourOption[] = [
  {
    id: 'tour-free',
    title: '자유 탐방',
    duration: '1~2시간',
    price: 0,
    memberPrice: 0,
    summary: '지도를 보며 원하는 곳만 골라 걸어요. 마을회관에서 종이 지도를 받을 수 있어요.',
    route: ['hall', 'tree', 'cafe', 'stonewall'],
  },
  {
    id: 'tour-guide',
    title: '마을 해설사 동행',
    duration: '90분 · 매주 토 10시',
    price: 12000,
    memberPrice: 0,
    summary: '마을 해설사와 팽나무, 밭담, 감귤원을 돌며 상대리 농사와 마을 이야기를 들어요.',
    route: ['hall', 'tree', 'orchard', 'stonewall', 'cafe'],
  },
  {
    id: 'tour-run',
    title: '런닝 크루와 함께 달리기',
    duration: '60분 · 매주 일 7시',
    price: 8000,
    memberPrice: 5000,
    summary: '마을 런닝 크루와 들녘 코스를 함께 달리고, 카페에서 감귤 에이드로 마무리해요.',
    route: ['hall', 'cafe', 'cabbage', 'photo'],
  },
];

export const RUN_COURSES: RunCourse[] = [
  {
    id: 'run-stonewall',
    name: '밭담 감귤 루프',
    level: '초급',
    distanceKm: 3.2,
    gainM: 14,
    path: 'M200 150 L166 116 C140 98 120 88 108 90 C88 112 92 168 118 192 C146 206 180 178 200 150',
    elevation: [0, 4, 9, 14, 8, 3, 0],
    surface: '포장 농로 70% · 흙길 30%',
    bestTime: '아침 7~9시',
    highlights: ['tree', 'orchard', 'stonewall'],
    water: '출발점(마을회관), 팽나무 쉼터',
    caution: '농로에 경운기가 다녀요. 밭 안으로는 들어가지 마세요.',
  },
  {
    id: 'run-sunset',
    name: '양배추 들녘 선셋 런',
    level: '중급',
    distanceKm: 5.4,
    gainM: 22,
    path: 'M200 150 L238 124 C282 128 334 150 322 178 C316 198 300 212 288 214 C258 240 210 244 180 226 C168 202 188 170 200 150',
    elevation: [0, 2, -3, -6, -2, 4, 9, 6, 2, 0],
    surface: '포장 농로 90%',
    bestTime: '해 질 무렵 (겨울 오후 5시 전후)',
    highlights: ['cafe', 'cabbage', 'photo'],
    water: '마을회관, 감귤 창고 카페',
    caution: '해가 지면 금방 어두워져요. 밝은 옷과 라이트를 챙기세요.',
  },
  {
    id: 'run-oreum',
    name: '오름 기슭 업힐 런',
    level: '상급',
    distanceKm: 7.8,
    gainM: 68,
    path: 'M200 150 C250 150 320 150 360 176 C386 202 382 246 340 256 C290 266 230 256 200 240 C160 224 150 190 200 150',
    elevation: [0, 6, 18, 34, 52, 68, 55, 38, 22, 10, 3, 0],
    surface: '포장 도로 60% · 흙길 40%',
    bestTime: '아침 6~8시 (바람이 약할 때)',
    highlights: ['cabbage'],
    water: '마을회관만 있어요. 물을 꼭 챙기세요.',
    caution: '중간 오르막 구간은 갓길이 좁아요. 차량을 마주 보고 달리세요.',
  },
];

export const PACE_OPTIONS = [
  { sec: 330, label: '5:30', note: '빠르게' },
  { sec: 390, label: '6:30', note: '보통' },
  { sec: 450, label: '7:30', note: '여유 있게' },
  { sec: 600, label: '10:00', note: '걷뛰' },
];

export const fmtDuration = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};

export const fmtPace = (sec: number) => `${Math.floor(sec / 60)}'${String(Math.round(sec % 60)).padStart(2, '0')}"`;
