import { CloudRain, Droplet, Leaf, Play, RotateCcw, Sparkles, Sprout, ThermometerSnowflake, Truck, Wind } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_CHOICE,
  FERTS,
  SEASONS,
  WATERS,
  evaluateSeason,
  getAge,
  getVariety,
  planKey,
  recommendedPlan,
  simulatePlan,
  weatherOf,
} from '../data/trees';
import type { GrowthStageId, MyFarm, PlanResult, SeasonChoice, SeasonId, TreePlan } from '../types';
import CropIllustration from './CropIllustration';
import DurungBubble from './DurungBubble';
import { GuideLink } from './GuideBook';
import type { GuideChapterId } from '../data/guide';

interface Props {
  farm: MyFarm;
  onSavePlan: (plan: TreePlan) => void;
  onResult: (result: PlanResult) => void;
  onHarvest: () => void;
  onOpenGuide?: (chapter: GuideChapterId) => void;
}

const WEATHER_ICON = { rain: CloudRain, dry: Sparkles, typhoon: Wind, cold: ThermometerSnowflake };
const MOOD_STYLE = {
  good: 'bg-green-50 text-green-800 ring-green-200',
  ok: 'bg-stone-50 text-stone-600 ring-stone-200',
  bad: 'bg-red-50 text-red-700 ring-red-200',
};

/** 1~3년 키우기 계획 게임 */
export default function TreePlanner({ farm, onSavePlan, onResult, onHarvest, onOpenGuide }: Props) {
  const variety = getVariety(farm.variety);
  const ageOpt = getAge(farm.treeAge);
  const years = ageOpt.years;
  const startYear = new Date(farm.adoptedAt).getFullYear() + 1;
  const plan = farm.plan ?? {};
  const [year, setYear] = useState(1);
  const [step, setStep] = useState<number | null>(null); // 시뮬레이션 진행 중인 계절 번호
  const timer = useRef<number>();

  const preview = useMemo(() => simulatePlan(plan, years, farm.variety), [plan, years, farm.variety]);
  const totalSteps = years * SEASONS.length;
  const running = step !== null && step < totalSteps;
  const result = farm.planResult;
  const filled = Object.keys(plan).length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (season: SeasonId, patch: Partial<SeasonChoice>) => {
    const key = planKey(year, season);
    onSavePlan({ ...plan, [key]: { ...(plan[key] ?? DEFAULT_CHOICE), ...patch } });
  };

  const run = () => {
    const full: TreePlan = {};
    for (let y = 1; y <= years; y++) for (const s of SEASONS) full[planKey(y, s.id)] = plan[planKey(y, s.id)] ?? DEFAULT_CHOICE;
    onSavePlan(full);
    const tick = (i: number) => {
      setStep(i);
      if (i < totalSteps) timer.current = window.setTimeout(() => tick(i + 1), 420);
      else {
        const r = simulatePlan(full, years, farm.variety);
        onResult({ health: r.health, brix: r.brix, yieldKg: r.yieldKg, grade: r.grade, at: new Date().toISOString() });
      }
    };
    tick(0);
  };

  // 시뮬레이션 중 나무 모습
  const progress = step === null ? (result ? 1 : 0) : step / totalSteps;
  const simStage: GrowthStageId = progress >= 1 ? 'ready' : progress > 0.75 ? 'almost' : progress > 0.3 ? 'growing' : 'seed';
  const curStep = step !== null && step > 0 ? preview.steps[Math.min(step, totalSteps) - 1] : null;

  return (
    <section className="card overflow-hidden">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 border-b border-stone-100 p-5 md:flex-row md:items-end md:justify-between md:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine">Grow Plan</p>
          <h3 className="mt-1 text-xl font-extrabold md:text-2xl">
            {farm.nickname}의 {years}년 키우기 계획
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {variety.name} · {ageOpt.label}로 시작 · 계절마다 비료와 물을 정해 주세요. {years > 1 && '어린나무라 마지막 해에 첫 수확해요.'}
          </p>
          {onOpenGuide && <GuideLink className="mt-2" label="비료·물 고르는 법 · 직접 키우기 가이드북" onOpen={() => onOpenGuide('care')} />}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onSavePlan(recommendedPlan(years))} disabled={running} className="btn-ghost px-3 py-2 text-sm">
            <Leaf size={15} /> 농부님 추천 계획
          </button>
          <button onClick={() => onSavePlan({})} disabled={running} className="btn-ghost px-3 py-2 text-sm">
            <RotateCcw size={15} /> 비우기
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        {/* 계획판 */}
        <div className="min-w-0 p-5 md:p-6">
          {/* 연차 탭 */}
          <div className="mb-4 flex gap-2 overflow-x-auto" role="tablist">
            {Array.from({ length: years }, (_, i) => i + 1).map((y) => (
              <button
                key={y}
                role="tab"
                aria-selected={year === y}
                onClick={() => setYear(y)}
                className={`shrink-0 rounded-2xl px-4 py-2 text-left transition ${year === y ? 'bg-basalt text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                <span className="block text-sm font-extrabold">
                  {y}년째 <span className="font-semibold opacity-70">· {startYear + y - 1}</span>
                </span>
                <span className={`block text-[11px] ${year === y ? 'text-orange-300' : 'text-stone-400'}`}>
                  나무 {ageOpt.age + y - 1}년생{y === years ? ' · 수확하는 해 🍊' : ''}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SEASONS.map((s) => {
              const c = plan[planKey(year, s.id)] ?? DEFAULT_CHOICE;
              const set = !!plan[planKey(year, s.id)];
              const o = evaluateSeason(year, s.id, c);
              const w = weatherOf(year, s.id);
              const WIcon = w ? WEATHER_ICON[w.effect] : null;
              return (
                <div key={s.id} className={`rounded-2xl border-2 p-4 transition ${set ? 'border-stone-200 bg-white' : 'border-dashed border-stone-200 bg-stone-50/60'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-lg font-black">{s.label}</span>
                      <span className="ml-1.5 text-xs font-semibold text-stone-400">{s.months}</span>
                    </div>
                    {w && WIcon && (
                      <span className="chip bg-sky-100 text-sky-800">
                        <WIcon size={12} /> {w.label}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500">{s.tip}</p>

                  <div className="mt-3 text-[11px] font-bold text-stone-500">비료</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {FERTS.map((f) => (
                      <button
                        key={f.id}
                        title={f.desc}
                        disabled={running}
                        onClick={() => choose(s.id, { fert: f.id })}
                        aria-pressed={c.fert === f.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          c.fert === f.id ? 'bg-cabbage text-white' : 'bg-stone-100 text-stone-600 hover:bg-green-50'
                        }`}
                      >
                        {f.short}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-[11px] font-bold text-stone-500">물</div>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    {WATERS.map((wt) => (
                      <button
                        key={wt.id}
                        disabled={running}
                        onClick={() => choose(s.id, { water: wt.id })}
                        aria-pressed={c.water === wt.id}
                        className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition ${
                          c.water === wt.id ? 'bg-sky-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-sky-50'
                        }`}
                      >
                        <span className="flex">
                          {Array.from({ length: wt.drops }).map((_, i) => (
                            <Droplet key={i} size={10} fill="currentColor" />
                          ))}
                        </span>
                        {wt.label}
                      </button>
                    ))}
                  </div>

                  <p className={`mt-3 rounded-xl px-2.5 py-1.5 text-xs ring-1 ${MOOD_STYLE[o.mood]}`}>
                    {o.mood === 'good' ? '👍 ' : o.mood === 'bad' ? '⚠️ ' : ''}
                    {o.note}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-stone-400">
            정한 칸 {filled}/{totalSteps} · 정하지 않은 계절은 '비료 없음 · 물 보통'으로 키워요. 효과는 시연용 예시예요.
          </p>
        </div>

        {/* 미리보기 / 시뮬레이션 */}
        <aside className="border-t border-stone-100 bg-stone-50/70 p-5 lg:border-l lg:border-t-0">
          <div className="relative aspect-[300/220] overflow-hidden rounded-2xl">
            <CropIllustration crop="tangerine" stage={simStage} growth={Math.round(progress * 100)} cover />
            {curStep && running && (
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
                {curStep.year}년째 {SEASONS.find((x) => x.id === curStep.season)!.label}
              </span>
            )}
          </div>

          {running && curStep ? (
            <div className="mt-3 space-y-2">
              <Meter label="나무 건강" value={curStep.healthAfter} />
              <p className={`rounded-xl px-3 py-2 text-xs ring-1 ${MOOD_STYLE[curStep.outcome.mood]}`}>{curStep.outcome.note}</p>
            </div>
          ) : result && step === null ? (
            <ResultCard result={result} varietyName={variety.name} />
          ) : step !== null && !running && result ? (
            <ResultCard result={result} varietyName={variety.name} />
          ) : (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-bold text-stone-500">이 계획대로라면</div>
              <Meter label="나무 건강" value={preview.health} />
              <div className="grid grid-cols-2 gap-2 text-center">
                <Mini label="예상 당도" value={`${preview.brix} Brix`} />
                <Mini label="첫 수확량" value={`약 ${preview.yieldKg}kg`} />
              </div>
            </div>
          )}

          <button onClick={run} disabled={running} className="btn-orange mt-4 w-full py-3">
            <Play size={16} /> {running ? `키우는 중… ${Math.round(progress * 100)}%` : result ? '이 계획으로 다시 키워보기' : `이 계획으로 ${years}년 키워보기`}
          </button>
          {result && !running && (
            <button onClick={onHarvest} disabled={farm.harvested} className="btn-green mt-2 w-full py-3">
              <Truck size={16} /> {farm.harvested ? '수확 꾸러미 신청 완료' : '수확한 열매 집으로 받기'}
            </button>
          )}
          {!result && !running && (
            <DurungBubble
              size={52}
              className="mt-4"
              message={years > 1 ? `어린나무는 ${years}년 동안 튼튼하게 키워야 열매를 맺어! 날씨 예보를 보고 물을 조절해 봐.` : '올해 바로 수확하는 나무야. 가을엔 물을 줄이면 더 달아져!'}
            />
          )}
        </aside>
      </div>
    </section>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? 'bg-cabbage' : value >= 50 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-stone-500">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-2 py-2 ring-1 ring-stone-200">
      <div className="text-[10px] font-semibold text-stone-400">{label}</div>
      <div className="text-sm font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

const GRADE_TEXT = {
  S: '최고예요! 마을 품평회에 나가도 되겠어요',
  A: '아주 잘 키웠어요. 달고 탐스러워요',
  B: '무난하게 잘 자랐어요',
  C: '조금 아쉬워요. 계획을 바꿔 다시 키워볼까요?',
};

function ResultCard({ result, varietyName }: { result: PlanResult; varietyName: string }) {
  return (
    <div className="mt-3 animate-pop rounded-2xl bg-white p-4 ring-1 ring-stone-200">
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-tangerine text-3xl font-black text-white">{result.grade}</span>
        <div className="min-w-0">
          <div className="text-xs font-bold text-stone-400">{varietyName} 수확 결과</div>
          <div className="text-sm font-semibold">{GRADE_TEXT[result.grade]}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Mini label="건강" value={`${result.health}`} />
        <Mini label="당도" value={`${result.brix}`} />
        <Mini label="수확량" value={`${result.yieldKg}kg`} />
      </div>
      <p className="mt-2 flex items-center gap-1 text-[11px] text-stone-500">
        <Sprout size={12} /> 실제 열매는 농부님이 수확해 첫 수확 시기에 보내드려요.
      </p>
    </div>
  );
}
