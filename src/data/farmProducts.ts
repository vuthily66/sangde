import type { FarmProduct } from '../types';

export const FARM_PRODUCTS: FarmProduct[] = [
  {
    id: 'tangerine',
    slot: '구좌 A',
    name: '상대리 감귤·만감류 나무',
    emoji: '🍊',
    monthlyPrice: 29000,
    expectedYield: '약 40kg',
    yieldNote: '15년생 이상 성목 기준 30~50kg · 10kg 상자로 나눠 배송',
    tagline: '감귤·한라봉·천혜향·레드향 중 한 그루',
    description: '한림의 해풍과 현무암 토양이 키운, 당도 12브릭스 이상의 노지 감귤 나무 한 그루를 분양받아요.',
    features: ['1~3년 동안 비료와 물을 직접 계획하는 키우기 게임', '나무 앞 실물 이름표 설치', '수확한 열매를 집으로 산지 직송'],
    accent: 'orange',
    season: {
      startMonth: 3,
      contractMonths: 10,
      recruitMonths: [1, 2, 3],
      harvestStart: { offset: 8, day: 10 }, // 11월 10일
      harvestEnd: { offset: 9, day: 31 }, // 12월 31일
      phases: [
        { label: '가지치기·거름', months: [3], tone: 'care' },
        { label: '새순', months: [4], tone: 'grow' },
        { label: '개화', months: [5], tone: 'bloom' },
        { label: '열매 비대', months: [6, 7, 8, 9], tone: 'grow' },
        { label: '착색', months: [10], tone: 'ripen' },
        { label: '수확', months: [11, 12], tone: 'harvest' },
      ],
      stageSeasons: { seed: '3~4월', growing: '5~9월', almost: '10월', ready: '11~12월' },
      why: '봄 가지치기부터 함께해야 5월 꽃과 가을 착색까지 한 해 농사를 온전히 경험할 수 있어요. 노지 조생 감귤은 11월 중순부터 당도가 오릅니다.',
    },
  },
  {
    id: 'cabbage',
    slot: '구좌 B',
    name: '상대리 아삭 양배추 밭',
    emoji: '🥬',
    monthlyPrice: 19000,
    expectedYield: '5통',
    yieldNote: '통당 2~3kg · 수확 기간 중 한 번에 배송',
    tagline: '겨울 해풍이 키운 월동 양배추',
    description: '겨울 제주 양배추의 주산지, 상대리 밭 한 이랑을 분양받아 아삭하고 단단한 양배추를 키워요.',
    features: ['밭 이랑 실물 팻말 설치', '직접 키우기 또는 농부 위탁 재배 선택', '작업마다 사진·측정값 재배 일지'],
    accent: 'green',
    season: {
      startMonth: 8,
      contractMonths: 7,
      recruitMonths: [6, 7],
      harvestStart: { offset: 4, day: 15 }, // 12월 15일
      harvestEnd: { offset: 6, day: 28 }, // 이듬해 2월 28일
      phases: [
        { label: '육묘', months: [8], tone: 'care' },
        { label: '아주심기', months: [9], tone: 'grow' },
        { label: '잎 생육', months: [10], tone: 'grow' },
        { label: '결구', months: [11], tone: 'ripen' },
        { label: '수확', months: [12, 1, 2], tone: 'harvest' },
      ],
      stageSeasons: { seed: '8~9월', growing: '10월', almost: '11월', ready: '12~2월' },
      why: '한림 월동 양배추는 늦여름에 모종을 길러 9월에 밭에 옮겨 심고, 겨울 해풍을 맞으며 단단하게 결구된 12월부터 수확해요.',
    },
  },
];

export const getProduct = (id: string) => FARM_PRODUCTS.find((p) => p.id === id)!;
