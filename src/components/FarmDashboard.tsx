import { CalendarDays, Droplets, Gift, Lock, PartyPopper, Sprout, Sun, Thermometer, Wind } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { CARE_ACTIONS, DURUNG_GREETINGS, ENVIRONMENT, GROWTH_STAGES, getStage } from '../data/farmCare';
import { getProduct } from '../data/farmProducts';
import type { CareAction, LogEntry, MyFarm, PlanResult, TreePlan } from '../types';
import { daysSince, formatDate, pick, randInt } from '../utils';
import CropIllustration from './CropIllustration';
import DurungBubble from './DurungBubble';
import CropCalendar from './CropCalendar';
import CultivationLog from './CultivationLog';
import TreePlanner from './TreePlanner';
import GuideBook, { GuideLink } from './GuideBook';
import type { GuideChapterId } from '../data/guide';
import { getAge } from '../data/trees';
import { FARMERS, getCareMode } from '../data/cultivation';
import CropImage from './CropImage';
import { daysUntil, farmSchedule, ym, ymd } from '../season';

interface Props {
  farms: MyFarm[];
  selectedFarmId: string | null;
  onSelectFarm: (id: string) => void;
  onCare: (farmId: string, boost: number) => void;
  onHarvest: (farmId: string) => void;
  onGoRental: () => void;
  onAddEntry: (farmId: string, entry: LogEntry) => void;
  onUpdateEntry: (farmId: string, taskId: string, patch: (e: LogEntry) => LogEntry) => void;
  onSavePlan: (farmId: string, plan: TreePlan) => void;
  onPlanResult: (farmId: string, result: PlanResult) => void;
}

interface FloatTag {
  id: number;
  text: string;
}

export default function FarmDashboard({ farms, selectedFarmId, onSelectFarm, onCare, onHarvest, onGoRental, onAddEntry, onUpdateEntry, onSavePlan, onPlanResult }: Props) {
  const farm = farms.find((f) => f.id === selectedFarmId) ?? farms[0];
  const [message, setMessage] = useState('');
  const [floats, setFloats] = useState<FloatTag[]>([]);
  const [cooling, setCooling] = useState<string | null>(null);
  const [guide, setGuide] = useState<GuideChapterId | null>(null);

  useEffect(() => {
    if (!farm) return;
    setMessage(
      farm.harvested
        ? DURUNG_GREETINGS.harvested(farm.nickname)
        : farm.growth >= 100
          ? DURUNG_GREETINGS.ready(farm.nickname)
          : DURUNG_GREETINGS.farmStart(farm.nickname),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm?.id]);

  if (!farm) {
    return (
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center">
        <DurungBubble message="아직 분양받은 농장이 없어! 분양소에서 첫 작물을 데려와 줘 🌱" />
        <button onClick={onGoRental} className="btn-orange">
          <Sprout size={18} /> 농장 분양소로 가기
        </button>
      </div>
    );
  }

  const product = getProduct(farm.cropType);
  const stage = getStage(farm.growth);
  const isReady = farm.growth >= 100;
  const isOrange = farm.cropType === 'tangerine';
  const careMode = getCareMode(farm.careMode);
  const sc = farmSchedule(farm, careMode.monthlyDiscount);
  const dHarvest = daysUntil(sc.harvestStart);
  const dStart = daysUntil(sc.seasonStart);

  const handleCare = (action: CareAction) => {
    if (isReady || cooling) return;
    const boost = randInt(...action.boost);
    const next = Math.min(100, farm.growth + boost);
    onCare(farm.id, boost);
    const id = Date.now();
    setFloats((f) => [...f, { id, text: `${action.emoji} +${next - farm.growth}%` }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1000);
    setCooling(action.id);
    setTimeout(() => setCooling(null), 450);

    const prevStage = getStage(farm.growth).id;
    const nextStage = getStage(next);
    if (next >= 100) setMessage(DURUNG_GREETINGS.ready(farm.nickname));
    else if (nextStage.id !== prevStage) setMessage(`축하해! '${farm.nickname}'이(가) [${nextStage.label}] 단계로 올라갔어! ${nextStage.description} ✨`);
    else setMessage(pick(action.messages));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 & 농장 선택 */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-bold text-cabbage">MY VIRTUAL FARM</span>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            <CropImage crop={farm.cropType} size={44} className="drop-shadow" /> {farm.nickname}의 스마트 농장
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-stone-500">
            <span>{product.slot} · {product.name}</span>
            <span className="font-semibold text-basalt">{careMode.title} · 담당 {FARMERS[farm.cropType].name}</span>
            <span className="flex items-center gap-1"><CalendarDays size={14} /> {formatDate(farm.adoptedAt)} 분양 · D+{daysSince(farm.adoptedAt)}</span>
          </p>
          {farm.cropType === 'tangerine' && <GuideLink className="mt-1.5" label="내 감귤나무 직접 키우기 가이드북" onOpen={() => setGuide('start')} />}
        </div>
        {farms.length > 1 && (
          <div className="flex gap-2 rounded-2xl bg-stone-100 p-1">
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFarm(f.id)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${f.id === farm.id ? 'bg-white shadow-sm' : 'text-stone-500'}`}
              >
                <CropImage crop={f.cropType} size={22} className="-my-1 mr-1 align-middle" />{f.nickname}
              </button>
            ))}
          </div>
        )}
      </div>

      {farm.cropType === 'tangerine' && (
        <TreePlanner
          farm={farm}
          onSavePlan={(plan) => onSavePlan(farm.id, plan)}
          onResult={(r) => onPlanResult(farm.id, r)}
          onHarvest={() => onHarvest(farm.id)}
          onOpenGuide={setGuide}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 작물 비주얼 */}
        <div className="card overflow-hidden">
          <div className="relative aspect-[300/220] w-full">
            <CropIllustration crop={farm.cropType} stage={stage.id} growth={farm.growth} />
            <span className={`chip absolute left-4 top-4 text-white shadow ${isReady ? 'bg-tangerine animate-bob' : 'bg-basalt/80'}`}>
              {stage.label}
            </span>
            <span className="chip absolute right-4 top-4 bg-white/90 text-basalt shadow">🪧 {farm.nickname}</span>
            <div className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center">
              {floats.map((f) => (
                <span key={f.id} className="absolute animate-float-up text-2xl font-extrabold text-cabbage drop-shadow">
                  {f.text}
                </span>
              ))}
            </div>
          </div>
          {/* 성장 프로그레스 */}
          <div className="p-5">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm font-semibold text-stone-500">작물 성장률</span>
              <span className={`text-3xl font-extrabold ${isOrange ? 'text-tangerine' : 'text-cabbage'}`}>{farm.growth}%</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${isOrange ? 'bg-gradient-to-r from-amber-300 to-tangerine' : 'bg-gradient-to-r from-lime-300 to-cabbage'}`}
                style={{ width: `${farm.growth}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-4 text-center text-[11px] font-semibold">
              {GROWTH_STAGES.map((s) => {
                const reached = farm.growth >= s.min;
                return (
                  <div key={s.id} className={reached ? 'text-basalt' : 'text-stone-300'}>
                    <div className={`mx-auto mb-1 h-2.5 w-2.5 rounded-full ${reached ? (isOrange ? 'bg-tangerine' : 'bg-cabbage') : 'bg-stone-200'}`} />
                    {s.label}
                    <span className="block text-[10px] font-medium text-stone-400">{product.season.stageSeasons[s.id]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 사이드: 환경 + 액션 */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">상대리 실시간 환경</h3>
              <span className="chip bg-green-50 text-cabbage">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cabbage" /> LIVE
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <EnvCard icon={<Thermometer size={18} />} label="기온" value={`${ENVIRONMENT.temperature}°C`} color="text-tangerine bg-orange-50" />
              <EnvCard icon={<Droplets size={18} />} label="습도" value={`${ENVIRONMENT.humidity}%`} color="text-sky-600 bg-sky-50" />
              <EnvCard icon={<Sun size={18} />} label="일조량" value={ENVIRONMENT.sunlight} color="text-amber-500 bg-amber-50" />
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-stone-400">
              <Wind size={12} /> {ENVIRONMENT.wind} · {ENVIRONMENT.location} 스마트팜 센서
            </p>
          </div>

          <div className="card flex-1 bg-gradient-to-b from-orange-50/60 to-white p-5">
            <DurungBubble message={message} mood={isReady ? 'excited' : 'happy'} size={70} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {CARE_ACTIONS.map((a) => (
                <button
                  key={a.id}
                  disabled={isReady}
                  onClick={() => handleCare(a)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-white px-2 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-tangerine hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                    cooling === a.id ? 'scale-95 border-tangerine' : 'border-stone-100'
                  }`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  {a.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-stone-400">총 {farm.actionCount}번 돌봐줬어요</p>
            {isReady && !farm.harvested && (
              <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-center text-xs text-tangerine-dark">
                실제 수확은 <b>{ymd(sc.harvestStart)} ~ {ymd(sc.harvestEnd)}</b>이에요. 지금 신청하면 수확 첫 주에 먼저 보내드려요.
              </p>
            )}

            <button
              disabled={!isReady || farm.harvested}
              onClick={() => {
                onHarvest(farm.id);
              }}
              className={`mt-4 w-full py-4 text-base ${isReady && !farm.harvested ? 'btn-orange animate-pulse' : 'btn-ghost'}`}
            >
              {farm.harvested ? (
                <><Gift size={18} /> 수확 완료 · 꾸러미 혜택 적용 중</>
              ) : isReady ? (
                <><PartyPopper size={18} /> 수확 및 꾸러미 신청하기</>
              ) : (
                <><Lock size={16} /> 성장률 100% 달성 시 수확 가능 ({100 - farm.growth}% 남음)</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 실제 재배 일정 */}
      <div className="card p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h3 className="font-bold">상대리 실제 재배 일정</h3>
            <p className="mt-1 text-sm text-stone-500">
              예상 수확량 {product.expectedYield} ({product.yieldNote}).
              <br />
              가상 농장의 성장은 게임이고, 실제 {isOrange ? '감귤 나무' : '양배추 밭'}은 아래 달력대로 자라요.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center md:w-[420px]">
            <Stat label="분양 기간" value={`${ym(sc.seasonStart).slice(2)}~${ym(sc.contractEnd).slice(2)}`} sub={dStart > 0 ? `시작까지 D-${dStart}` : farm.cropType === 'tangerine' ? `${getAge(farm.treeAge).years}년` : `${product.season.contractMonths}개월`} />
            <Stat label="수확 시작" value={ymd(sc.harvestStart).slice(2)} sub={dHarvest > 0 ? `D-${dHarvest}` : '수확 중'} accent />
            <Stat label="수확 마감" value={ymd(sc.harvestEnd).slice(2)} sub={`예상 ${product.expectedYield}`} />
          </div>
        </div>
        <div className="mt-6 overflow-x-auto pb-5">
          <div className="min-w-[420px]">
            <CropCalendar product={product} />
          </div>
        </div>
      </div>

      <CultivationLog farm={farm} onAddEntry={onAddEntry} onUpdateEntry={onUpdateEntry} onOpenGuide={setGuide} />
      <GuideBook open={guide !== null} start={guide ?? 'start'} onClose={() => setGuide(null)} />
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${accent ? 'bg-orange-50' : 'bg-stone-50'}`}>
      <div className="text-[11px] font-semibold text-stone-500">{label}</div>
      <div className={`text-sm font-extrabold tabular-nums ${accent ? 'text-tangerine' : ''}`}>{value}</div>
      <div className="text-[11px] font-semibold text-stone-400">{sub}</div>
    </div>
  );
}

function EnvCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`rounded-2xl p-3 ${color}`}>
      {icon}
      <div className="mt-1 text-[11px] font-semibold text-stone-500">{label}</div>
      <div className="text-lg font-extrabold text-basalt">{value}</div>
    </div>
  );
}
