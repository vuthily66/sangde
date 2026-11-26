// 장터 상품 사진
import beetImg from '../assets/shop/beet.webp';
import broccoliImg from '../assets/shop/broccoli.webp';
import cabbageImg from '../assets/shop/cabbage.webp';
import kohlrabiImg from '../assets/shop/kohlrabi.webp';
import broccoliBasketImg from '../assets/shop/broccoli-basket.webp';
import cabbageHalfImg from '../assets/shop/cabbage-half.webp';
import bundleImg from '../assets/shop/bundle.webp';

/**
 * 판매처(장터). 스토어 주소를 넣으면 '구매하기' 버튼이 그 주소로 바로 열려요.
 * 예) storeUrl: 'https://smartstore.naver.com/내스토어이름'
 */
export type ChannelId = 'naver' | 'kakao' | 'app';

export interface Channel {
  id: ChannelId;
  name: string;
  short: string;
  desc: string;
  storeUrl?: string; // 외부 장터 주소 (비어 있으면 연결 준비 중)
}

export const CHANNELS: Channel[] = [
  { id: 'naver', name: '네이버 스마트스토어', short: '네이버', desc: '네이버페이로 간편 결제', storeUrl: '' },
  { id: 'kakao', name: '카카오톡 스토어', short: '카카오', desc: '카카오페이·선물하기', storeUrl: '' },
  { id: 'app', name: '상대로운 바로 주문', short: '바로 주문', desc: '이 사이트에서 바로 주문' },
];

export type ShopCategory = '양배추' | '브로콜리' | '비트' | '콜라비' | '꾸러미';

export interface ShopProduct {
  id: string;
  name: string;
  category: ShopCategory;
  images: string[]; // 꾸러미는 여러 장
  amount: string; // 중량·구성
  price: number; // 정가
  salePrice: number; // 판매가
  badges: string[];
  season: string;
  desc: string;
  storage: string;
  recipe: string;
  links?: Partial<Record<'naver' | 'kakao', string>>; // 상품별 판매 페이지 주소
}

// 가격·구성은 시연용 예시예요.
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'cabbage-2',
    name: '제주 한림 월동 양배추',
    category: '양배추',
    images: [cabbageHalfImg],
    amount: '2통 · 약 5kg',
    price: 12900,
    salePrice: 9900,
    badges: ['겨울 제철', '산지직송'],
    season: '12월 ~ 3월',
    desc: '겨울 해풍을 맞고 자라 속이 단단하고 단맛이 진해요. 생으로 먹어도 아삭해요.',
    storage: '신문지에 싸서 냉장 보관. 자른 면은 랩으로 감싸 3~4일 안에 드세요.',
    recipe: '코울슬로 · 양배추쌈 · 밀푀유나베',
  },
  {
    id: 'cabbage-4',
    name: '제주 한림 월동 양배추 대용량',
    category: '양배추',
    images: [cabbageImg],
    amount: '4통 · 약 10kg',
    price: 22900,
    salePrice: 17900,
    badges: ['대용량', '산지직송'],
    season: '12월 ~ 3월',
    desc: '식당·김장용으로 넉넉하게. 한 통씩 골라 무게를 맞춰 보내드려요.',
    storage: '서늘한 곳에서 2주까지 두고 드실 수 있어요.',
    recipe: '양배추 김치 · 볶음 · 수프',
  },
  {
    id: 'broccoli-1',
    name: '제주 브로콜리',
    category: '브로콜리',
    images: [broccoliImg],
    amount: '1kg · 3~4송이',
    price: 14900,
    salePrice: 11900,
    badges: ['겨울 제철', '산지직송'],
    season: '12월 ~ 3월',
    desc: '꽃봉오리가 촘촘하고 줄기까지 달아요. 수확 당일 포장해 보내드려요.',
    storage: '키친타월로 감싸 지퍼백에 넣어 냉장. 데쳐서 냉동하면 한 달까지.',
    recipe: '브로콜리 데침 · 스프 · 파스타',
  },
  {
    id: 'broccoli-2',
    name: '제주 브로콜리 넉넉하게',
    category: '브로콜리',
    images: [broccoliBasketImg],
    amount: '2kg · 7~8송이',
    price: 26900,
    salePrice: 21900,
    badges: ['대용량'],
    season: '12월 ~ 3월',
    desc: '온 가족이 일주일 동안 넉넉히 먹을 수 있는 양이에요.',
    storage: '먹을 만큼 데쳐 소분해 냉동해 두세요.',
    recipe: '샐러드 · 그라탕 · 볶음',
  },
  {
    id: 'beet-2',
    name: '제주 비트',
    category: '비트',
    images: [beetImg],
    amount: '2kg · 8~10개',
    price: 13900,
    salePrice: 10900,
    badges: ['겨울 제철', '산지직송'],
    season: '11월 ~ 3월',
    desc: '선명한 붉은 빛에 흙냄새가 적고 달큰해요. 즙·샐러드용으로 좋아요.',
    storage: '잎을 떼고 신문지에 싸서 냉장하면 2~3주 보관돼요.',
    recipe: '비트 주스 · 피클 · 구이',
  },
  {
    id: 'kohlrabi-3',
    name: '제주 콜라비',
    category: '콜라비',
    images: [kohlrabiImg],
    amount: '3kg · 6~8개',
    price: 15900,
    salePrice: 12900,
    badges: ['겨울 제철', '산지직송'],
    season: '11월 ~ 3월',
    desc: '무처럼 아삭하고 배처럼 시원하게 달아요. 껍질만 벗겨 바로 드세요.',
    storage: '비닐에 담아 냉장하면 2주까지 아삭해요.',
    recipe: '콜라비 생채 · 깍두기 · 샐러드',
  },
  {
    id: 'mix-winter',
    name: '상대리 겨울채소 모둠 꾸러미',
    category: '꾸러미',
    images: [bundleImg],
    amount: '양배추 1통 · 브로콜리 1kg · 비트 1kg · 콜라비 1.5kg',
    price: 32900,
    salePrice: 24900,
    badges: ['인기 구성', '산지직송'],
    season: '12월 ~ 3월',
    desc: '상대리 겨울 밭의 네 가지 채소를 한 상자에. 처음 맛보는 분께 추천해요.',
    storage: '채소마다 보관법 카드를 함께 넣어드려요.',
    recipe: '채소 한 상자로 일주일 식단',
  },
];

export const SHOP_CATEGORIES: ('전체' | ShopCategory)[] = ['전체', '양배추', '브로콜리', '비트', '콜라비', '꾸러미'];

export const discountRate = (p: ShopProduct) => Math.round((1 - p.salePrice / p.price) * 100);

/** 상품을 이 판매처에서 살 수 있는 주소 (없으면 undefined) */
export const buyUrl = (p: ShopProduct, ch: Channel) => (ch.id === 'app' ? undefined : p.links?.[ch.id] || ch.storeUrl || undefined);
