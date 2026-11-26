import { ArrowRight, CalendarRange, Check, ChevronDown, ChevronLeft, ChevronRight, MapPin, Package, Scale, Sprout, Wheat } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { FARM_PRODUCTS, getProduct } from '../data/farmProducts';
import { getSchedule, getTreeSchedule, monthsLabel, ym, type TreeChoice } from '../season';
import type { CareMode, CropType, FarmProduct, MyFarm, TreeAge, VarietyId } from '../types';
import { AGE_OPTIONS, VARIETIES, getAge, getVariety, treeMonthly } from '../data/trees';
import fieldLeaves from '../assets/photos/field-leaves.webp';
import orchardBush from '../assets/photos/orchard-bush.webp';
import hallabongImg from '../assets/photos/hallabong.webp';
import redhyangImg from '../assets/photos/redhyang.webp';
import tangerineClose from '../assets/photos/tangerine-close.webp';
import { won } from '../utils';
import CropCalendar from './CropCalendar';
import fieldSky from '../assets/photos/field-sky.webp';
import onionRows from '../assets/photos/onion-rows.webp';
import orchardWall from '../assets/photos/orchard-wall.webp';
import CropImage from './CropImage';
import NicknameModal from './NicknameModal';
import SeasonSummary from './SeasonSummary';

interface Props {
  farms: MyFarm[];
  onAdopt: (crop: CropType, nickname: string, careMode: CareMode, tree?: TreeChoice) => void;
  onGoFarm: (farmId: string) => void;
  onGoTravel: () => void;
}

const STEPS = [
  { icon: Sprout, title: '분양' },
  { icon: Scale, title: '키우기' },
  { icon: Package, title: '수확·배송' },
  { icon: MapPin, title: '마을 여행' },
];

export default function FarmRental({ farms, onAdopt, onGoFarm, onGoTravel }: Props) {
  const [selected, setSelected] = useState<{ product: FarmProduct; tree?: TreeChoice } | null>(null);

  return (
    <div className="space-y-14 pb-8 md:space-y-20">
      {/* 이용 흐름: 아이콘 한 줄 */}
      <ol className="mx-auto flex max-w-3xl items-center justify-between gap-1" aria-label="이용 순서">
        {STEPS.map(({ icon: Icon, title }, i) => (
          <li key={title} className="flex flex-1 items-center gap-1">
            <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${i % 2 ? 'bg-cabbage-light text-cabbage' : 'bg-tangerine-light text-tangerine'}`}>
                <Icon size={22} />
              </span>
              <span className="text-xs font-bold sm:text-sm">{title}</span>
            </div>
            {i < STEPS.length - 1 && <ArrowRight size={16} className="mb-6 shrink-0 text-stone-300" />}
          </li>
        ))}
      </ol>

      {/* 분양 상품 */}
      <section id="products" className="scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <SectionTitle eyebrow="Farm Rental" title="어떤 농장을 키울까요?" />
          <NowInVillage />
        </div>
        <h3 className="mb-3 text-lg font-extrabold">감귤·만감류 나무</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {VARIETIES.map((v, i) => {
            const p = getProduct('tangerine');
            return (
              <ProductCard
                key={v.id}
                product={p}
                variety={v.id}
                slot={`구좌 A-${i + 1}`}
                owned={farms.find((f) => f.cropType === 'tangerine' && (f.variety ?? 'gamgyul') === v.id)}
                onSelect={(tree) => setSelected({ product: p, tree })}
                onGoFarm={onGoFarm}
              />
            );
          })}
        </div>
        <h3 className="mb-3 mt-10 text-lg font-extrabold">채소 밭</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {FARM_PRODUCTS.filter((p) => p.id !== 'tangerine').map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              owned={farms.find((f) => f.cropType === p.id)}
              onSelect={(tree) => setSelected({ product: p, tree })}
              onGoFarm={onGoFarm}
            />
          ))}
        </div>
      </section>

      <Discover onGoTravel={onGoTravel} />

      <NicknameModal
        product={selected?.product ?? null}
        tree={selected?.tree}
        onClose={() => setSelected(null)}
        onConfirm={(name, mode) => {
          if (selected) onAdopt(selected.product.id, name, mode, selected.tree);
          setSelected(null);
        }}
      />
    </div>
  );
}

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-[0.25em] ${light ? 'text-orange-300' : 'text-tangerine'}`}>{eyebrow}</p>
      <h2 className="mt-1.5 text-3xl font-black tracking-tight md:text-4xl" style={{ textWrap: 'balance' }}>
        {title}
      </h2>
    </div>
  );
}

/** 상대리 풍경 카드 캐러셀 */
const SCENES: { id: string; tag: string; title: string; line: string; bg: string; art: ReactNode }[] = [
  { id: 'orchard', tag: 'Farm', title: '감귤원', line: '11월, 나무마다 귤이 주렁주렁', bg: 'from-amber-200 to-orange-400', art: <Photo src={orchardWall} position="50% 55%" /> },
  { id: 'field', tag: 'Farm', title: '겨울 들녘', line: '겨울 해풍 속 초록 물결', bg: 'from-lime-200 to-green-500', art: <Photo src={fieldSky} position="50% 65%" /> },
  { id: 'wall', tag: 'Walk', title: '밭담길', line: '현무암 돌담 사이 1.2km', bg: 'from-sky-200 to-slate-500', art: <Photo src={orchardWall} position="50% 100%" /> },
  { id: 'onion', tag: 'Farm', title: '양파밭', line: '줄지어 자라는 겨울 양파', bg: 'from-lime-200 to-green-600', art: <Photo src={onionRows} position="50% 60%" /> },
  { id: 'cafe', tag: 'Cafe', title: '감귤 창고 카페', line: '돌창고에서 마시는 감귤 에이드', bg: 'from-orange-300 to-rose-500', art: <BigMotif crop="tangerine" emoji="☕" /> },
  { id: 'oreum', tag: 'Nearby', title: '금오름', line: '정상에서 보는 한림 들녘', bg: 'from-emerald-300 to-teal-700', art: <BigMotif emoji="⛰️" /> },
  { id: 'sea', tag: 'Nearby', title: '협재 해변', line: '에메랄드빛 서쪽 바다', bg: 'from-cyan-200 to-sky-600', art: <BigMotif emoji="🏝️" /> },
];

function Photo({ src, position = 'center' }: { src: string; position?: string }) {
  return <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: position }} />;
}

function BigMotif({ emoji, crop }: { emoji: string; crop?: CropType }) {
  return (
    <div className="relative grid h-full w-full place-items-center">
      <span className="text-[7rem] drop-shadow-xl">{emoji}</span>
      {crop && <CropImage crop={crop} size={90} className="absolute bottom-[38%] right-[18%] drop-shadow-xl" />}
    </div>
  );
}

function Discover({ onGoTravel }: { onGoTravel: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  return (
    <section id="discover" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <SectionTitle eyebrow="Discover Sangdae-ri" title="상대리에서 만나는 풍경" />
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} aria-label="이전" className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 hover:bg-white">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} aria-label="다음" className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 hover:bg-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {SCENES.map((c) => (
          <button
            key={c.id}
            onClick={onGoTravel}
            className={`group relative aspect-[3/4] w-[68%] shrink-0 snap-start overflow-hidden rounded-3xl bg-gradient-to-br text-left shadow-md sm:w-64 md:w-72 ${c.bg}`}
          >
            <div className="absolute inset-0 transition duration-500 group-hover:scale-105">{c.art}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">{c.tag}</span>
              <h3 className="mt-1 text-2xl font-black">{c.title}</h3>
              <p className="mt-1 text-sm text-white/85">{c.line}</p>
            </div>
          </button>
        ))}
        <button
          onClick={onGoTravel}
          className="flex aspect-[3/4] w-[68%] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-tangerine hover:text-tangerine sm:w-64 md:w-72"
        >
          <MapPin size={28} />
          <span className="font-bold">마을 지도·런닝 코스 보기</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

// 품종별 카드 사진 (상대리 감귤밭 사진을 나눠 씀)
const VARIETY_PHOTO: Record<VarietyId, { src: string; pos: string }> = {
  gamgyul: { src: tangerineClose, pos: '50% 58%' },
  hallabong: { src: hallabongImg, pos: '50% 50%' },
  cheonhyehyang: { src: orchardBush, pos: '50% 60%' },
  redhyang: { src: redhyangImg, pos: '60% 50%' },
};

function ProductCard({
  product: p,
  variety: fixedVariety,
  slot,
  owned,
  onSelect,
  onGoFarm,
}: {
  product: FarmProduct;
  variety?: VarietyId;
  slot?: string;
  owned?: MyFarm;
  onSelect: (tree?: TreeChoice) => void;
  onGoFarm: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isTree = p.id === 'tangerine';
  const variety: VarietyId = fixedVariety ?? 'gamgyul';
  const [age, setAge] = useState<TreeAge>(3);
  const tree: TreeChoice | undefined = isTree ? { variety, age } : undefined;
  const isOrange = p.accent === 'orange';
  const sc = tree ? getTreeSchedule(p, tree) : getSchedule(p);
  const harvestMonths = p.season.phases.find((ph) => ph.tone === 'harvest')!.months;
  const monthly = tree ? treeMonthly(variety, age) : p.monthlyPrice;
  const v = getVariety(variety);
  const ageOpt = getAge(age);

  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden bg-stone-200">
        <img
          src={isTree ? VARIETY_PHOTO[variety].src : fieldLeaves}
          alt={isTree ? '상대리 감귤밭' : '상대리 겨울 들녘'}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          style={{ objectPosition: isTree ? VARIETY_PHOTO[variety].pos : '50% 50%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
        <span className={`chip absolute left-4 top-4 text-white ${isOrange ? 'bg-tangerine' : 'bg-cabbage'}`}>{slot ?? p.slot}</span>
        <span className="chip absolute right-4 top-4 bg-white/90 text-basalt shadow-sm">
          {owned ? (
            <>
              <Check size={12} /> 분양 중
            </>
          ) : sc.status === 'open' ? (
            '지금 모집 중'
          ) : (
            `${ym(sc.seasonStart)} 시즌 사전 예약`
          )}
        </span>
        {isTree && <span className="absolute bottom-3 left-4 text-sm font-bold text-white drop-shadow">{v.name} · {ageOpt.label}</span>}
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold">{isTree ? `상대리 ${v.name} 나무` : p.name}</h3>
            <p className="text-sm text-stone-500">{isTree ? v.taste : p.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className={`text-2xl font-black tabular-nums ${isOrange ? 'text-tangerine' : 'text-cabbage'}`}>{won(monthly)}</div>
            <div className="text-[11px] font-semibold text-stone-400">매월</div>
          </div>
        </div>

        {isTree && !owned && (
          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1.5 text-xs font-bold text-stone-500">나무 나이</div>
              <div className="grid grid-cols-3 gap-1.5">
                {AGE_OPTIONS.map((o) => (
                  <button
                    key={o.age}
                    onClick={() => setAge(o.age)}
                    aria-pressed={age === o.age}
                    className={`rounded-xl border-2 px-2 py-2 text-center transition ${
                      age === o.age ? 'border-tangerine bg-orange-50' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{o.label}</span>
                    <span className="block text-[11px] text-stone-500">{o.years}년 키우기</span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-stone-500">
                {age === 3 ? '🍊 ' : '🌱 '}
                {ageOpt.summary}
                {age < 3 && ' · 어린나무는 바로 수확하기 어려워요'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2">
          {isTree ? (
            <>
              <Fact icon={<Scale size={16} />} label="첫 수확량" value={`약 ${v.firstYieldKg}kg`} />
              <Fact icon={<Wheat size={16} />} label="첫 수확" value={ym(sc.harvestStart)} />
              <Fact icon={<CalendarRange size={16} />} label="키우기" value={`${ageOpt.years}년`} />
            </>
          ) : (
            <>
              <Fact icon={<Scale size={16} />} label="수확량" value={p.expectedYield.replace('약 ', '')} />
              <Fact icon={<Wheat size={16} />} label="수확" value={monthsLabel(harvestMonths)} />
              <Fact icon={<CalendarRange size={16} />} label="분양" value={`${p.season.contractMonths}개월`} />
            </>
          )}
        </div>

        {owned ? (
          <button onClick={() => onGoFarm(owned.id)} className="btn-dark mt-5 w-full py-3.5">
            '{owned.nickname}' 돌보러 가기 <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={() => onSelect(tree)} className={`${isOrange ? 'btn-orange' : 'btn-green'} mt-5 w-full py-3.5`}>
            {isTree ? `${v.name} ${ageOpt.label} 분양받기` : '분양받기'} <ArrowRight size={18} />
          </button>
        )}

        <button
          onClick={() => setOpen((x) => !x)}
          aria-expanded={open}
          className="mt-3 flex w-full items-center justify-center gap-1 py-1 text-sm font-semibold text-stone-500 hover:text-basalt"
        >
          일정·재배 방식 자세히 보기 <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-3 animate-pop space-y-4">
            <SeasonSummary product={p} tree={tree} />
            <div className="rounded-2xl bg-stone-50 px-4 pb-4 pt-3">
              <CropCalendar product={p} compact />
              <p className="mt-3 text-xs leading-relaxed text-stone-500">{p.season.why}</p>
            </div>
            <ul className="space-y-1.5">
              {(isTree ? p.features : [p.yieldNote, ...p.features]).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check size={15} className={`mt-0.5 shrink-0 ${isOrange ? 'text-tangerine' : 'text-cabbage'}`} /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-stone-50 px-2 py-3 text-center">
      <span className="text-stone-400">{icon}</span>
      <span className="text-[11px] font-semibold text-stone-400">{label}</span>
      <span className="text-sm font-extrabold tabular-nums">{value}</span>
    </div>
  );
}

/** 이번 달 상대리 밭의 실제 상황 */
function NowInVillage() {
  const m = new Date().getMonth() + 1;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold text-stone-400">지금 상대리 {m}월</span>
      {FARM_PRODUCTS.map((p) => {
        const label = p.season.phases.find((ph) => ph.months.includes(m))?.label ?? '밭 정리';
        return (
          <span key={p.id} className="chip bg-white py-1 pl-1 pr-3 text-basalt ring-1 ring-stone-200">
            <CropImage crop={p.id} size={22} />
            <b className={p.accent === 'orange' ? 'text-tangerine' : 'text-cabbage'}>{label}</b>
          </span>
        );
      })}
    </div>
  );
}
