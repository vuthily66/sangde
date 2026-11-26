import { Clock, Droplets, ExternalLink, Flag, Footprints, MapPin, Medal, Mountain, Play, Route, ShieldAlert, Sun, Users } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PACE_OPTIONS, PLACES, PLACE_CATEGORY, RUN_COURSES, TOUR_OPTIONS, VILLAGE_QUERY, fmtDuration, fmtPace, kakaoSearchUrl } from '../data/explore';
import type { RunCourse, RunRecord } from '../types';
import { won } from '../utils';
import VillageMap from './VillageMap';

interface Props {
  isMember: boolean;
  reserved: string[];
  runs: RunRecord[];
  onReserve: (id: string, detail: string) => void;
  onRun: (record: RunRecord) => void;
}

type Mode = 'places' | 'running';

export default function VillageExplore({ isMember, reserved, runs, onReserve, onRun }: Props) {
  const [mode, setMode] = useState<Mode>('places');

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold">🧭 마을 탐방</h3>
          <p className="text-sm text-stone-500">마을회관에서 출발해 걷거나 달려보세요.</p>
        </div>
        <a href={kakaoSearchUrl(VILLAGE_QUERY)} target="_blank" rel="noopener noreferrer" className="btn bg-[#FEE500] px-4 py-2 text-sm text-[#191919] hover:brightness-95">
          <MapPin size={15} /> 카카오맵에서 상대리 보기 <ExternalLink size={13} />
        </a>
        <div className="flex rounded-2xl bg-stone-100 p-1" role="tablist">
          {(
            [
              ['places', '명소 지도', <MapPin key="i" size={15} />],
              ['running', '런닝 코스', <Footprints key="i" size={15} />],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${mode === id ? 'bg-white text-basalt shadow-sm' : 'text-stone-500'}`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'places' ? (
        <PlacesView isMember={isMember} reserved={reserved} onReserve={onReserve} />
      ) : (
        <RunningView runs={runs} onRun={onRun} />
      )}
      <p className="mt-3 text-[11px] text-stone-400">위 지도는 시연용 안내도예요. 실제 위치는 노란 카카오맵 버튼으로 확인하세요.</p>
    </section>
  );
}

/* ───────── 명소 ───────── */

function PlacesView({ isMember, reserved, onReserve }: { isMember: boolean; reserved: string[]; onReserve: (id: string, detail: string) => void }) {
  const [active, setActive] = useState<string>('cafe');
  const [tour, setTour] = useState<string | null>(null);
  const place = PLACES.find((p) => p.id === active)!;
  const cat = PLACE_CATEGORY[place.category];
  const tourRoute = TOUR_OPTIONS.find((t) => t.id === tour)?.route ?? [];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="card overflow-hidden">
          <div className="aspect-[400/280] w-full">
            <VillageMap activePlaceId={active} onSelectPlace={setActive} highlightIds={tourRoute} />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-stone-100 px-4 py-2.5">
            {Object.entries(PLACE_CATEGORY).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1 text-[11px] text-stone-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.color }} /> {v.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {/* 선택한 장소 */}
          <div key={place.id} className="card animate-pop p-5">
            <span className={`chip ${cat.chip}`}>{cat.label}</span>
            <h4 className="mt-2 text-xl font-extrabold">{place.name}</h4>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{place.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="chip bg-stone-100 text-stone-600"><Clock size={12} /> 머무는 시간 {place.stay}</span>
              <span className="chip bg-stone-100 text-stone-600"><Footprints size={12} /> {place.access}</span>
            </div>
            {place.tip && <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-xs text-tangerine-dark">💡 {place.tip}</p>}
            <a
              href={kakaoSearchUrl(place.kakaoQuery ?? VILLAGE_QUERY)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-3 w-full bg-[#FEE500] py-2.5 text-sm text-[#191919] hover:brightness-95"
            >
              <MapPin size={15} /> {place.kakaoQuery ? `카카오맵에서 ${place.name} 보기` : '카카오맵에서 상대리 위치 보기'} <ExternalLink size={13} />
            </a>
          </div>
          {/* 장소 목록 */}
          <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
            {PLACES.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => setActive(p.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active === p.id ? 'bg-basalt text-white' : 'bg-white ring-1 ring-stone-200 hover:ring-stone-300'
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black text-white" style={{ background: PLACE_CATEGORY[p.category].color }}>
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                  <span className={`shrink-0 text-[11px] ${active === p.id ? 'text-white/70' : 'text-stone-400'}`}>{p.access}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 탐방 방식 */}
      <div>
        <h4 className="mb-3 font-bold">탐방 방식 고르기</h4>
        <div className="grid gap-3 md:grid-cols-3">
          {TOUR_OPTIONS.map((t) => {
            const price = isMember ? t.memberPrice : t.price;
            const done = reserved.includes(t.id);
            const selected = tour === t.id;
            return (
              <div key={t.id} className={`card flex flex-col p-4 transition ${selected ? 'ring-2 ring-tangerine' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-extrabold">{t.title}</h5>
                  <span className="shrink-0 text-right">
                    <span className="block font-black tabular-nums text-tangerine">{price ? `${won(price)}` : '무료'}</span>
                    {isMember && t.price > t.memberPrice && <span className="block text-[10px] text-stone-400 line-through">{won(t.price)}</span>}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-stone-400">{t.duration}{price ? ' · 1인' : ''}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{t.summary}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setTour(selected ? null : t.id)} className="btn-ghost flex-1 px-3 py-2 text-xs">
                    <Route size={14} /> {selected ? '경로 숨기기' : '경로 보기'}
                  </button>
                  {t.id !== 'tour-free' && (
                    <button
                      disabled={done}
                      onClick={() => onReserve(t.id, `${t.title} 신청이 완료됐어요! (${t.duration.split(' · ')[1] ?? t.duration})`)}
                      className="btn-dark flex-1 px-3 py-2 text-xs"
                    >
                      <Users size={14} /> {done ? '신청 완료' : '신청하기'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!isMember && <p className="mt-2 text-xs text-stone-500">농장을 분양받으면 해설사 동행은 무료, 런닝 크루는 할인돼요.</p>}
      </div>
    </div>
  );
}

/* ───────── 런닝 ───────── */

const LEVEL_STYLE: Record<RunCourse['level'], string> = {
  초급: 'bg-green-100 text-green-800',
  중급: 'bg-amber-100 text-amber-800',
  상급: 'bg-red-100 text-red-700',
};
const LEVEL_COLOR: Record<RunCourse['level'], string> = { 초급: '#16A34A', 중급: '#F97316', 상급: '#DC2626' };

function RunningView({ runs, onRun }: { runs: RunRecord[]; onRun: (r: RunRecord) => void }) {
  const [courseId, setCourseId] = useState(RUN_COURSES[0].id);
  const [pace, setPace] = useState(PACE_OPTIONS[1].sec);
  const [progress, setProgress] = useState<number | null>(null);
  const [justDone, setJustDone] = useState<RunRecord | null>(null);
  const raf = useRef<number>();
  const course = RUN_COURSES.find((c) => c.id === courseId)!;
  const color = LEVEL_COLOR[course.level];
  const estimate = course.distanceKm * pace;
  const running = progress !== null && progress < 1;

  useEffect(() => () => cancelAnimationFrame(raf.current!), []);

  const selectCourse = (id: string) => {
    if (running) return;
    cancelAnimationFrame(raf.current!);
    setCourseId(id);
    setProgress(null);
    setJustDone(null);
  };

  const start = () => {
    setJustDone(null);
    const dur = 4500;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        const actualPace = Math.round(pace * (0.94 + Math.random() * 0.12));
        const rec: RunRecord = { courseId: course.id, paceSec: actualPace, seconds: Math.round(actualPace * course.distanceKm), at: new Date().toISOString() };
        onRun(rec);
        setJustDone(rec);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const mine = runs.filter((r) => r.courseId === course.id);
  const best = mine.length ? mine.reduce((a, b) => (a.seconds < b.seconds ? a : b)) : null;
  const totalKm = runs.reduce((sum, r) => sum + (RUN_COURSES.find((c) => c.id === r.courseId)?.distanceKm ?? 0), 0);
  const doneCourses = new Set(runs.map((r) => r.courseId));

  return (
    <div className="space-y-4">
      {/* 코스 선택 */}
      <div className="grid grid-cols-3 gap-2">
        {RUN_COURSES.map((c) => {
          const sel = c.id === courseId;
          return (
            <button
              key={c.id}
              onClick={() => selectCourse(c.id)}
              disabled={running && !sel}
              className={`rounded-2xl p-3 text-left transition ${sel ? 'bg-basalt text-white shadow-lg' : 'bg-white ring-1 ring-stone-200 hover:ring-stone-300'} disabled:opacity-50`}
            >
              <span className={`chip px-2 py-0.5 text-[10px] ${LEVEL_STYLE[c.level]}`}>{c.level}</span>
              <span className="mt-1.5 block text-sm font-extrabold leading-tight">{c.name}</span>
              <span className={`mt-1 block text-lg font-black tabular-nums ${sel ? 'text-orange-300' : 'text-tangerine'}`}>
                {c.distanceKm}
                <span className="text-xs font-bold">km</span>
              </span>
              {doneCourses.has(c.id) && <span className={`text-[10px] font-bold ${sel ? 'text-green-300' : 'text-cabbage'}`}>✓ 완주</span>}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* 지도 */}
        <div className="card relative overflow-hidden">
          <div className="aspect-[400/280] w-full">
            <VillageMap routePath={course.path} routeColor={color} highlightIds={course.highlights} progress={progress} />
          </div>
          {progress !== null && (
            <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{running ? '달리는 중…' : '완주!'}</span>
                <span className="tabular-nums">
                  {(course.distanceKm * progress).toFixed(1)} / {course.distanceKm}km
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: color }} />
              </div>
            </div>
          )}
        </div>

        {/* 코스 정보 */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={<Route size={15} />} label="거리" value={`${course.distanceKm}km`} />
              <Stat icon={<Mountain size={15} />} label="누적 상승" value={`+${course.gainM}m`} />
              <Stat icon={<Sun size={15} />} label="추천 시간" value={course.bestTime.split(' (')[0]} />
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] font-semibold text-stone-400">
                <span>고도 변화</span>
                <span>출발 대비 최고 +{Math.max(...course.elevation)}m</span>
              </div>
              <ElevationChart values={course.elevation} color={color} progress={progress} />
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-2 text-sm font-bold">내 페이스로 예상 시간</div>
            <div className="grid grid-cols-4 gap-1.5">
              {PACE_OPTIONS.map((o) => (
                <button
                  key={o.sec}
                  onClick={() => setPace(o.sec)}
                  disabled={running}
                  className={`rounded-xl px-1 py-2 text-center transition ${pace === o.sec ? 'bg-tangerine text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  <span className="block text-sm font-black tabular-nums">{o.label}</span>
                  <span className="block text-[10px] font-semibold opacity-80">{o.note}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-xs text-stone-500">km당 {fmtPace(pace)} 기준</span>
              <span className="text-2xl font-black tabular-nums">약 {fmtDuration(estimate)}</span>
            </div>
            <button onClick={start} disabled={running} className="btn-orange mt-3 w-full py-3">
              <Play size={16} /> {running ? '달리는 중…' : '시연: 이 코스 달리기'}
            </button>
            {justDone && (
              <p className="mt-2 animate-pop rounded-xl bg-green-50 px-3 py-2 text-center text-sm font-semibold text-cabbage-dark">
                🎉 {fmtDuration(justDone.seconds)} 완주 · 평균 {fmtPace(justDone.paceSec)}/km
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 코스 안내 + 내 기록 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2.5 p-4 text-sm">
          <Info icon={<Flag size={15} />} label="지나는 곳" value={course.highlights.map((id) => PLACES.find((p) => p.id === id)!.name).join(' · ')} />
          <Info icon={<Footprints size={15} />} label="노면" value={course.surface} />
          <Info icon={<Droplets size={15} />} label="물 보충" value={course.water} />
          <Info icon={<ShieldAlert size={15} />} label="주의" value={course.caution} warn />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">내 런닝 기록</span>
            <span className="text-xs font-semibold text-stone-500 tabular-nums">누적 {totalKm.toFixed(1)}km · {runs.length}회</span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-stone-50 p-3">
            <Medal size={28} className={doneCourses.size === RUN_COURSES.length ? 'text-amber-500' : 'text-stone-300'} />
            <div className="min-w-0 text-sm">
              <div className="font-bold">상대리 러너 배지</div>
              <div className="text-xs text-stone-500">
                {doneCourses.size === RUN_COURSES.length ? '3개 코스를 모두 완주했어요!' : `코스 3개 중 ${doneCourses.size}개 완주`}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-stone-500">
            이 코스 최고 기록{' '}
            <b className="text-base tabular-nums text-basalt">{best ? fmtDuration(best.seconds) : '–'}</b>
            {best && <span> · {fmtPace(best.paceSec)}/km</span>}
          </div>
          {mine.length > 0 && (
            <ul className="mt-2 space-y-1">
              {mine
                .slice(-3)
                .reverse()
                .map((r) => (
                  <li key={r.at} className="flex justify-between text-xs tabular-nums text-stone-500">
                    <span>{new Date(r.at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</span>
                    <span>
                      {fmtDuration(r.seconds)} · {fmtPace(r.paceSec)}/km
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-1 py-2">
      <span className="flex justify-center text-stone-400">{icon}</span>
      <span className="block text-[10px] font-semibold text-stone-400">{label}</span>
      <span className="block text-sm font-extrabold tabular-nums">{value}</span>
    </div>
  );
}

function Info({ icon, label, value, warn }: { icon: ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-0.5 ${warn ? 'text-red-500' : 'text-stone-400'}`}>{icon}</span>
      <span className="w-14 shrink-0 text-stone-500">{label}</span>
      <span className={`min-w-0 ${warn ? 'text-red-700' : 'font-semibold'}`}>{value}</span>
    </div>
  );
}

/** 출발점 대비 고도 프로필 */
function ElevationChart({ values, color, progress }: { values: number[]; color: string; progress: number | null }) {
  const W = 300;
  const H = 64;
  const pad = 4;
  const min = Math.min(0, ...values);
  const max = Math.max(10, ...values);
  const x = (i: number) => pad + (i / (values.length - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(values.length - 1)} ${H} L${x(0)} ${H}Z`;
  const peak = values.indexOf(Math.max(...values));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-16 w-full" preserveAspectRatio="none" role="img" aria-label="고도 프로필">
      <line x1={pad} x2={W - pad} y1={y(0)} y2={y(0)} stroke="#E7E5E4" strokeDasharray="3 3" />
      <path d={area} fill={color} opacity="0.15" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={x(peak)} cy={y(values[peak])} r="3.5" fill={color} />
      {progress !== null && <line x1={pad + progress * (W - pad * 2)} x2={pad + progress * (W - pad * 2)} y1="0" y2={H} stroke="#1E293B" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
