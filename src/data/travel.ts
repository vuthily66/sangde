import type { StampMission, VisitBenefit } from '../types';

export const VISIT_BENEFITS: VisitBenefit[] = [
  {
    id: 'harvest-experience',
    title: '내 작물 수확 체험 예약',
    description: '분양받은 나무·밭에서 직접 수확하고, 마을 어르신과 함께하는 제주 농사 이야기를 들어요.',
    emoji: '🧺',
    cta: '체험 예약하기',
    kind: 'reservation',
  },
  {
    id: 'cafe-coupon',
    title: '마을 카페 음료 쿠폰',
    description: '감귤 창고를 개조한 마을 카페에서 감귤 에이드 1잔을 무료로 즐겨요.',
    emoji: '🥤',
    cta: '쿠폰 받기',
    kind: 'coupon',
  },
];

export const STAMP_MISSIONS: StampMission[] = [
  {
    id: 'cabbage-photo',
    title: '양배추 밭 포토존',
    emoji: '🥬',
    location: '상대리 양배추 들녘',
    description: '끝없이 펼쳐진 초록 양배추 밭에서 인생샷 찰칵!',
  },
  {
    id: 'tangerine-cafe',
    title: '감귤 창고 카페',
    emoji: '🍊',
    location: '마을회관 옆 옛 감귤 창고',
    description: '60년 된 돌창고에서 감귤 에이드 한 잔의 여유',
  },
  {
    id: 'stonewall-walk',
    title: '돌담길 산책',
    emoji: '🪨',
    location: '상대리 밭담길 1.2km',
    description: '구불구불 현무암 밭담을 따라 걷는 제주의 시간',
  },
];
