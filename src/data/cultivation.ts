import type { CareModeOption, CropType, CultivationTask, Farmer } from '../types';

export const CARE_MODES: CareModeOption[] = [
  {
    id: 'farmer',
    title: '농부님께 맡기기',
    summary: '상대리 담당 농부가 대신 키우고, 모든 작업을 사진과 측정값으로 기록해요.',
    points: ['작업마다 현장 사진·측정값 기록', '기록을 보고 확인·질문 가능', '방문은 수확 체험만 선택'],
    monthlyDiscount: 0,
  },
  {
    id: 'self',
    title: '직접 키우기',
    summary: '가지치기·열매 솎기·수확 같은 핵심 작업은 상대리에 와서 직접 하고, 평소 관리는 농부님이 도와요.',
    points: ['핵심 작업 시기에 방문해 직접 작업', '작업 완료를 사진으로 인증', '월 분양료 5,000원 할인'],
    monthlyDiscount: 5000,
  },
];

export const getCareMode = (id: string | undefined) => CARE_MODES.find((m) => m.id === (id ?? 'farmer'))!;

// 화면에 보이는 농부 정보는 시연용 예시입니다.
export const FARMERS: Record<CropType, Farmer> = {
  tangerine: {
    name: '고순자 농부',
    career: '상대리 감귤 농사 32년',
    plot: '상대리 감귤원 A-12번 나무',
    greeting: '나무 상태는 제가 매주 살펴볼게요. 궁금한 건 일지에 남겨주세요!',
  },
  cabbage: {
    name: '강태호 농부',
    career: '한림 월동 양배추 21년',
    plot: '상대리 양배추밭 B-3이랑',
    greeting: '양배추는 겨울 바람이 키워요. 작업할 때마다 사진 올려드릴게요.',
  },
};

export const CULTIVATION_TASKS: Record<CropType, CultivationTask[]> = {
  tangerine: [
    { id: 't-prune', title: '봄 가지치기', offset: 0, day: 12, selfJoin: true, stage: 'seed', detail: '안쪽으로 자란 가지와 묵은 가지를 정리해 햇빛이 나무 속까지 들어가게 했어요.', metric: '정리한 가지 14개' },
    { id: 't-compost', title: '봄 거름 주기', offset: 0, day: 26, selfJoin: false, stage: 'seed', detail: '마을 공동 퇴비장에서 숙성한 유기질 퇴비를 나무 둘레에 넣었어요.', metric: '유기질 퇴비 20kg' },
    { id: 't-shoot', title: '새순 관리·병해충 살피기', offset: 1, day: 20, selfJoin: false, stage: 'seed', detail: '새순이 고르게 나왔어요. 진딧물 흔적은 없어서 약은 치지 않았습니다.', metric: '새순 길이 평균 6cm' },
    { id: 't-bloom', title: '꽃 상태 점검', offset: 2, day: 15, selfJoin: false, stage: 'growing', detail: '꽃이 활짝 폈어요. 꽃 수가 적당해서 올해 열매가 고르게 달릴 것 같아요.', metric: '개화율 약 85%' },
    { id: 't-thin1', title: '1차 열매 솎기', offset: 4, day: 10, selfJoin: true, stage: 'growing', detail: '작거나 상처 난 열매를 따서 남은 열매가 크게 자라도록 했어요.', metric: '솎은 열매 약 120개' },
    { id: 't-thin2', title: '2차 열매 솎기·태풍 대비', offset: 5, day: 20, selfJoin: true, stage: 'growing', detail: '한 번 더 솎고, 태풍에 대비해 가지에 지지대를 세웠어요.', metric: '지지대 3개 설치' },
    { id: 't-brix1', title: '당도 1차 측정', offset: 6, day: 15, selfJoin: false, stage: 'almost', detail: '열매 10개를 골라 당도와 산도를 쟀어요. 순조롭게 익고 있어요.', metric: '당도 8.2 Brix · 산도 1.6%' },
    { id: 't-color', title: '착색 점검·당도 2차 측정', offset: 7, day: 15, selfJoin: false, stage: 'almost', detail: '노랗게 물들기 시작했어요. 일교차가 커서 당도가 잘 오르고 있습니다.', metric: '당도 10.8 Brix · 착색 60%' },
    { id: 't-harvest', title: '수확', offset: 8, day: 10, selfJoin: true, stage: 'ready', detail: '잘 익은 열매부터 가위로 하나씩 땄어요. 10kg 상자에 나눠 담았습니다.', metric: '1차 수확 22kg · 당도 12.1 Brix' },
    { id: 't-ship', title: '마무리 수확·꾸러미 발송', offset: 9, day: 15, selfJoin: false, stage: 'ready', detail: '남은 열매를 모두 따서 꾸러미와 함께 산지 직송으로 보냈어요.', metric: '총 수확 41kg' },
  ],
  cabbage: [
    { id: 'c-seed', title: '씨 뿌리기·모종 기르기', offset: 0, day: 8, selfJoin: false, stage: 'seed', detail: '모종판에 씨를 뿌려 그늘막 아래에서 키우고 있어요.', metric: '모종판 128구 · 발아율 94%' },
    { id: 'c-plant', title: '밭에 아주심기', offset: 1, day: 6, selfJoin: true, stage: 'seed', detail: '본잎이 5장 나온 모종을 40cm 간격으로 밭에 옮겨 심었어요.', metric: '포기 간격 40cm' },
    { id: 'c-weed', title: '웃거름·김매기', offset: 1, day: 26, selfJoin: true, stage: 'growing', detail: '잡초를 뽑고 포기 사이에 웃거름을 줬어요.', metric: '토양 수분 31%' },
    { id: 'c-pest', title: '병해충 살피기', offset: 2, day: 15, selfJoin: false, stage: 'growing', detail: '배추좀나방 애벌레를 손으로 잡아냈어요. 친환경 방제로 관리 중이에요.', metric: '피해 잎 2% 미만' },
    { id: 'c-head', title: '결구 확인', offset: 3, day: 12, selfJoin: false, stage: 'almost', detail: '속이 차기 시작했어요. 손으로 눌러보면 단단해지고 있습니다.', metric: '결구 지름 약 14cm' },
    { id: 'c-frost', title: '한파 대비 점검', offset: 3, day: 28, selfJoin: false, stage: 'almost', detail: '서리 예보가 있어 바깥 잎을 덮어 속잎이 얼지 않게 했어요.', metric: '최저기온 2°C' },
    { id: 'c-harvest', title: '수확', offset: 4, day: 15, selfJoin: true, stage: 'ready', detail: '단단하게 찬 양배추를 칼로 밑동을 잘라 수확했어요.', metric: '평균 2.6kg · 5통' },
    { id: 'c-ship', title: '꾸러미 발송', offset: 4, day: 18, selfJoin: false, stage: 'ready', detail: '수확 48시간 안에 꾸러미로 포장해 산지 직송했어요.', metric: '배송 출발' },
  ],
};

export const FARMER_REPLIES = [
  '네, 확인했어요! 다음 작업 때 사진 더 꼼꼼히 찍어둘게요.',
  '좋은 질문이에요. 다음 방문 때 나무 앞에서 직접 보여드릴게요.',
  '걱정 마세요. 지금 아주 건강하게 자라고 있어요 😊',
];
