import type { MealKit, PackageOption } from '../types';

export const MEAL_KITS: MealKit[] = [
  {
    id: 'chicken-wrap',
    name: '감귤 치킨랩 키트',
    emoji: '🌯',
    price: 14900,
    ingredients: ['상대리 감귤', '닭가슴살', '또띠아', '감귤 마요소스'],
    localCrop: 'tangerine',
    servings: '2인분',
    cookTime: '15분',
    tag: '고단백 · 브런치',
  },
  {
    id: 'coleslaw-sandwich',
    name: '감귤 코울슬로 샌드위치 키트',
    emoji: '🥪',
    price: 12900,
    ingredients: ['상대리 양배추', '감귤 드레싱', '통밀 식빵', '당근'],
    localCrop: 'cabbage',
    servings: '2인분',
    cookTime: '10분',
    tag: '아삭 · 피크닉',
  },
  {
    id: 'millefeuille-nabe',
    name: '감귤 폰즈 밀푀유나베 키트',
    emoji: '🍲',
    price: 24900,
    ingredients: ['상대리 양배추', '제주 흑돼지', '감귤 폰즈소스', '표고버섯'],
    localCrop: 'cabbage',
    servings: '2~3인분',
    cookTime: '25분',
    tag: '시그니처 · 겨울별미',
  },
];

export const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: 'basic',
    name: '기본형 꾸러미',
    price: 29000,
    description: '1~2인 가구에 딱 맞는 상대리 제철 농산물',
    contents: ['내 농장 수확물', '제철 채소 3종', '감귤청 1병'],
  },
  {
    id: 'family',
    name: '가족형 꾸러미',
    price: 49000,
    description: '3~4인 가족을 위한 넉넉한 구성',
    contents: ['내 농장 수확물', '제철 채소 6종', '감귤청 2병', '제주 보리빵 세트'],
  },
];

export const PRICING_RULES = {
  memberDiscountRate: 0.1, // 분양 고객 10%
  harvestCredit: 5000, // 수확 완료 시 꾸러미 적립금 차감
  bundleThreshold: 3, // 밀키트 3개 이상
  bundleDiscountRate: 0.05, // 추가 5%
  shippingFee: 3500,
  freeShippingOver: 50000,
};
