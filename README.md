# 나의 제주 농장 (상대로운)

제주시 한림읍 상대리 감귤 나무·양배추 밭 온라인 분양 → 가상 재배 → 수확 꾸러미/밀키트 → 마을 여행 스탬프로 이어지는 O2O 게이미피케이션 프론트엔드 프로토타입.
백엔드·API 키 없이 Mock 데이터 + localStorage로 동작합니다.

## 실행
```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview   # 프로덕션 빌드 확인
```

## 구조
```
src/
├─ App.tsx                 전역 상태(localStorage) · 탭 전환 · 액션 핸들러
├─ types/index.ts          타입 정의
├─ data/                   farmProducts · farmCare(성장단계/환경/두룽 대사) · market · travel
├─ hooks/useLocalStorage.ts
├─ utils.ts
└─ components/
   ├─ Navbar · Modal · Toast · ResetButton
   ├─ Durung · DurungBubble        마스코트 SVG + 말풍선
   ├─ FarmRental · NicknameModal   1. 히어로 & 분양소
   ├─ FarmDashboard · CropIllustration  2. 스마트 대시보드
   ├─ MarketPage                   3. 밀키트 & 꾸러미 계산기
   └─ TravelPage · CertificateModal 4. 마을 여행 & 스탬프 패스포트
```

## 시연 팁
- 우측 하단 **Reset Demo** → 모든 상태 초기화
- 영양제 주기(+9~14%)를 연타하면 약 8~10회 만에 100% 도달
- 할인 규칙: 분양 고객 10% · 밀키트 3개 이상 5% · 수확 작물당 꾸러미 적립금 5,000원 · 50,000원 이상 무료배송
