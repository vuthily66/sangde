import type { CareAction, GrowthStage } from '../types';

export const CARE_ACTIONS: CareAction[] = [
  {
    id: 'water',
    label: '물 주기',
    emoji: '💧',
    boost: [6, 10],
    messages: [
      '시원하다~! 상대리 지하수는 정말 꿀맛이야 💧',
      '촉촉해졌어! 뿌리가 쭉쭉 뻗는 소리가 들려?',
      '물 한 모금에 잎사귀가 반짝반짝해졌어!',
    ],
  },
  {
    id: 'sun',
    label: '햇빛 쬐어주기',
    emoji: '☀️',
    boost: [5, 9],
    messages: [
      '한림 햇살 최고! 광합성 풀가동 중이야 ☀️',
      '따뜻해~ 당도가 쑥쑥 올라가는 중!',
      '돌담 너머 햇빛이 딱 좋게 들어오고 있어!',
    ],
  },
  {
    id: 'nutrient',
    label: '영양제 주기',
    emoji: '🌱',
    boost: [9, 14],
    messages: [
      '친환경 유기농 영양제! 힘이 불끈 솟아 🌱',
      '와, 에너지 충전 완료! 오늘 키 좀 크겠는데?',
      '상대리 퇴비로 만든 영양제라 더 건강해져!',
    ],
  },
];

export const GROWTH_STAGES: GrowthStage[] = [
  { id: 'seed', label: '씨앗 · 새싹', min: 0, description: '작은 새싹이 흙을 뚫고 나왔어요' },
  { id: 'growing', label: '개화 · 성장', min: 35, description: '꽃이 피고 잎이 무성해지고 있어요' },
  { id: 'almost', label: '수확 임박', min: 75, description: '열매가 탐스럽게 영글고 있어요' },
  { id: 'ready', label: '수확 가능!', min: 100, description: '지금 바로 수확할 수 있어요' },
];

export const getStage = (growth: number): GrowthStage =>
  [...GROWTH_STAGES].reverse().find((s) => growth >= s.min)!;

export const ENVIRONMENT = {
  temperature: 16,
  humidity: 65,
  sunlight: '최적',
  wind: '북서풍 3m/s',
  location: '제주시 한림읍 상대리',
};

export const DURUNG_GREETINGS = {
  noFarm: '안녕! 나는 상대리 마을 가이드 두룽이야 🍊🥬 마음에 드는 구좌를 골라 나만의 제주 농장을 시작해 봐!',
  farmStart: (name: string) => `반가워, ${name}! 오늘부터 우리 같이 무럭무럭 자라보자! 아래 버튼으로 돌봐줘~`,
  ready: (name: string) => `우와아! ${name}이(가) 다 자랐어! 🎉 이제 수확하고 꾸러미를 신청해 봐!`,
  harvested: (name: string) => `${name} 수확 완료! 상대리 밀키트로 맛있게 먹어줘 😋`,
};
