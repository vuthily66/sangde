import { useCallback, useEffect, useRef, useState } from 'react';
import FarmDashboard from './components/FarmDashboard';
import FarmRental from './components/FarmRental';
import MarketPage from './components/MarketPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ShopPage from './components/ShopPage';
import HomeSlider from './components/HomeSlider';
import ResetButton from './components/ResetButton';
import Toast from './components/Toast';
import TravelPage from './components/TravelPage';
import { getProduct } from './data/farmProducts';
import { farmSchedule, getSchedule, getTreeSchedule, ym, ymd, type TreeChoice } from './season';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppState, CareMode, CropType, LogEntry, TabId } from './types';

const STORAGE_KEY = 'sangdaeroun-demo-v1';

const INITIAL_STATE: AppState = {
  farms: [],
  selectedFarmId: null,
  cart: {},
  packageId: null,
  stamps: [],
  reservedBenefits: [],
  certificateIssuedAt: null,
  runs: [],
};

export default function App() {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, INITIAL_STATE);
  const [tab, setTabRaw] = useLocalStorage<{ id: TabId }>(`${STORAGE_KEY}-tab`, { id: 'rental' });
  const [toast, setToast] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const toastTimer = useRef<number>();

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const setTab = (id: TabId) => setTabRaw({ id });
  useEffect(() => {
    if (tab.id === 'market') setTabRaw({ id: 'rental' });
  }, [tab.id, setTabRaw]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab.id]);

  const update = (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) =>
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  // ---- 1. 분양 ----
  const adopt = (cropType: CropType, nickname: string, careMode: CareMode, tree?: TreeChoice) => {
    const id = `${cropType}-${Date.now().toString(36)}`;
    update((s) => ({
      farms: [...s.farms, { id, cropType, nickname, growth: 5, adoptedAt: new Date().toISOString(), harvested: false, actionCount: 0, careMode, log: [], variety: tree?.variety, treeAge: tree?.age }],
      selectedFarmId: id,
    }));
    const sc = tree ? getTreeSchedule(getProduct(cropType), tree) : getSchedule(getProduct(cropType));
    notify(`'${nickname}' ${sc.status === 'open' ? '분양' : `${ym(sc.seasonStart)} 시즌 사전 예약`} 완료! 내 농장으로 이동합니다`);
    setTab('farm');
  };

  // ---- 2. 대시보드 ----
  const care = (farmId: string, boost: number) =>
    update((s) => ({
      farms: s.farms.map((f) => (f.id === farmId ? { ...f, growth: Math.min(100, f.growth + boost), actionCount: f.actionCount + 1 } : f)),
    }));

  const harvest = (farmId: string) => {
    const farm = state.farms.find((f) => f.id === farmId);
    update((s) => ({
      farms: s.farms.map((f) => (f.id === farmId ? { ...f, harvested: true } : f)),
    }));
    const sc = farm && farmSchedule(farm);
    notify(`🎉 '${farm?.nickname}' 수확 신청 완료! ${sc ? `${ymd(sc.harvestStart)}부터 배송돼요` : ''}`);
  };

  // ---- 재배 일지 ----
  const addEntry = (farmId: string, entry: LogEntry) =>
    update((s) => ({ farms: s.farms.map((f) => (f.id === farmId ? { ...f, log: [...(f.log ?? []), entry] } : f)) }));

  const updateEntry = (farmId: string, taskId: string, patch: (e: LogEntry) => LogEntry) =>
    update((s) => ({
      farms: s.farms.map((f) => (f.id === farmId ? { ...f, log: (f.log ?? []).map((e) => (e.taskId === taskId ? patch(e) : e)) } : f)),
    }));

  // ---- 3. 마켓 ----
  const changeQty = (kitId: string, delta: number) =>
    update((s) => {
      const qty = Math.max(0, (s.cart[kitId] ?? 0) + delta);
      const cart = { ...s.cart, [kitId]: qty };
      if (qty === 0) delete cart[kitId];
      return { cart };
    });

  // ---- 4. 여행 ----
  const reserve = (id: string, detail: string) => {
    update((s) => ({ reservedBenefits: s.reservedBenefits.includes(id) ? s.reservedBenefits : [...s.reservedBenefits, id] }));
    notify(detail);
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}-tab`);
    } catch {
      /* noop */
    }
    setState(INITIAL_STATE);
    setTab('rental');
    notify('시연 데이터가 초기화되었어요');
  };

  const cartCount = Object.values(state.cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <Sidebar active={tab.id} onChange={setTab} cartCount={cartCount} overlay={tab.id === 'rental' && !scrolled} />
      {tab.id === 'rental' && (
        <div className="relative">
          <HomeSlider />
        </div>
      )}
      <Navbar active={tab.id} onChange={setTab} cartCount={cartCount} hasFarm={state.farms.length > 0} stampCount={state.stamps.length} overlay={tab.id === 'rental' && !scrolled} />
      <div className="md:pl-60">
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-12">
        {tab.id === 'rental' && (
          <FarmRental
            farms={state.farms}
            onAdopt={adopt}
            onGoTravel={() => setTab('travel')}
            onGoFarm={(id) => {
              update({ selectedFarmId: id });
              setTab('farm');
            }}
          />
        )}
        {tab.id === 'farm' && (
          <FarmDashboard
            farms={state.farms}
            selectedFarmId={state.selectedFarmId}
            onSelectFarm={(id) => update({ selectedFarmId: id })}
            onCare={care}
            onHarvest={harvest}
            onGoRental={() => setTab('rental')}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onSavePlan={(id, plan) => update((s) => ({ farms: s.farms.map((f) => (f.id === id ? { ...f, plan } : f)) }))}
            onPlanResult={(id, planResult) => update((s) => ({ farms: s.farms.map((f) => (f.id === id ? { ...f, planResult, growth: 100 } : f)) }))}
          />
        )}
        {tab.id === 'market' && (
          <MarketPage
            farms={state.farms}
            cart={state.cart}
            packageId={null}
            onChangeQty={changeQty}
            onSelectPackage={(packageId) => update({ packageId })}
            onOrder={() => update({ cart: {}, packageId: null })}
            onGoTravel={() => setTab('travel')}
          />
        )}
        {tab.id === 'shop' && <ShopPage onOrder={notify} />}
        {tab.id === 'travel' && (
          <TravelPage
            farms={state.farms}
            stamps={state.stamps}
            reservedBenefits={state.reservedBenefits}
            certificateIssuedAt={state.certificateIssuedAt}
            onStamp={(id) => update((s) => ({ stamps: s.stamps.includes(id) ? s.stamps : [...s.stamps, id] }))}
            onReserve={reserve}
            onIssueCertificate={() => update((s) => ({ certificateIssuedAt: s.certificateIssuedAt ?? new Date().toISOString() }))}
            onGoRental={() => setTab('rental')}
            runs={state.runs ?? []}
            onRun={(r) => update((s) => ({ runs: [...(s.runs ?? []), r] }))}
          />
        )}
      </main>
      </div>
      <footer className="mx-auto max-w-6xl px-4 pb-6 text-center text-xs text-stone-400 md:hidden">
        © 2026 상대로운 · 제주시 한림읍 상대리 마을 협동조합 | 시연용 프로토타입 (Mock Data)
      </footer>
      <Toast message={toast} />
      <ResetButton onReset={reset} />
    </div>
  );
}
