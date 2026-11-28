import { Copy, Gift, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import orchardWall from '../assets/photos/orchard-wall.webp';
import { RUN_COURSES } from '../data/explore';
import { STAMP_MISSIONS } from '../data/travel';
import { getVariety } from '../data/trees';
import type { MyFarm, RunRecord } from '../types';
import { formatDate } from '../utils';
import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  farms: MyFarm[];
  issuedAt: string | null;
  stamps?: string[];
  runs?: RunRecord[];
}

const NAME_KEY = 'sangdaeroun-resident-name';

// 명예 주민 혜택 (시연용 예시)
const PERKS = ['감귤 창고 카페 음료 상시 10% 할인', '수확 체험 우선 예약', '상대리 마을 잔치 초대장'];

/** 활동에 따라 붙는 칭호 */
function titleOf(farms: MyFarm[], runKm: number) {
  const tree = farms.find((f) => f.cropType === 'tangerine');
  if (tree && runKm > 0) return { title: '귤밭을 달리는 농부', line: `${getVariety(tree.variety).name} 나무를 키우고 들녘을 달렸어요` };
  if (tree) return { title: `${getVariety(tree.variety).name}나무 지기`, line: `'${tree.nickname}'의 든든한 주인이에요` };
  if (farms.length) return { title: '겨울 들녘 농부', line: `'${farms[0].nickname}'을 키우는 상대리 농부예요` };
  if (runKm > 0) return { title: '밭담길 러너', line: '상대리 들녘을 두 발로 달렸어요' };
  return { title: '돌담길 여행자', line: '상대리 구석구석을 걸어서 돌아봤어요' };
}

/** 상대리 명예 주민증 */
export default function CertificateModal({ open, onClose, farms, issuedAt, stamps = [], runs = [] }: Props) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  useEffect(() => {
    if (!open) return;
    setCopied(false);
    try {
      setName(localStorage.getItem(NAME_KEY) ?? '');
    } catch {
      /* 저장 못 해도 동작 */
    }
  }, [open]);
  const saveName = (v: string) => {
    setName(v);
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      /* noop */
    }
  };

  const date = issuedAt ?? new Date().toISOString();
  const no = `제 ${String(new Date(date).getTime()).slice(-4)} 호`;
  const runKm = runs.reduce((sum, r) => sum + (RUN_COURSES.find((c) => c.id === r.courseId)?.distanceKm ?? 0), 0);
  const t = titleOf(farms, runKm);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <article className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200">
        {/* 사진 머리 */}
        <div className="relative h-40">
          <img src={orchardWall} alt="상대리 감귤밭" className="h-full w-full object-cover" style={{ objectPosition: '50% 62%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-3 text-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-200">Honorary Resident</p>
              <h3 className="text-2xl font-black leading-tight drop-shadow">상대리 명예 주민증</h3>
            </div>
            <span className="font-brush text-3xl leading-none drop-shadow">상대로운</span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* 이름 + 칭호 */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="resident-name" className="flex items-center gap-1 text-[11px] font-bold text-stone-400">
                이름 <Pencil size={10} />
              </label>
              <input
                id="resident-name"
                value={name}
                maxLength={10}
                onChange={(e) => saveName(e.target.value)}
                placeholder="이름을 적어 주세요"
                className="w-full border-b-2 border-dashed border-stone-200 bg-transparent py-1 text-2xl font-black outline-none placeholder:text-stone-300 focus:border-tangerine"
              />
            </div>
            <div className="shrink-0 text-right text-[11px] leading-relaxed text-stone-400">
              <div className="font-bold tabular-nums text-basalt">{no}</div>
              <div className="tabular-nums">{formatDate(date)} 발급</div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3">
            <div className="text-[11px] font-bold text-tangerine">나의 칭호</div>
            <div className="text-lg font-black">🏅 {t.title}</div>
            <div className="text-xs text-stone-600">{t.line}</div>
          </div>

          {/* 스탬프 도장 */}
          <div className="grid grid-cols-3 gap-2">
            {STAMP_MISSIONS.map((m) => {
              const got = stamps.includes(m.id);
              return (
                <div key={m.id} className="flex flex-col items-center gap-1 text-center">
                  <span
                    className={`grid h-14 w-14 -rotate-12 place-items-center rounded-full border-[3px] border-double text-2xl ${
                      got ? 'border-red-500 bg-red-50' : 'border-stone-200 opacity-40 grayscale'
                    }`}
                  >
                    {m.emoji}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-stone-600">{m.title}</span>
                </div>
              );
            })}
          </div>

          {/* 기록 */}
          <div className="grid grid-cols-3 divide-x divide-stone-200 rounded-2xl bg-stone-50 py-3 text-center">
            <Stat label="키우는 작물" value={`${farms.length}`} unit="곳" />
            <Stat label="달린 거리" value={runKm.toFixed(1)} unit="km" />
            <Stat label="모은 도장" value={`${stamps.length}`} unit={`/${STAMP_MISSIONS.length}`} />
          </div>

          {/* 혜택 */}
          <div className="rounded-2xl border border-dashed border-cabbage/50 p-3">
            <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-cabbage-dark">
              <Gift size={13} /> 명예 주민 혜택
            </div>
            <ul className="space-y-1 text-[13px] text-stone-700">
              {PERKS.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </div>

          {/* 서명 */}
          <div className="flex items-end justify-between pt-1">
            <p className="text-[11px] leading-relaxed text-stone-500">
              위 사람을 제주 한림읍 상대리의
              <br />
              명예 주민으로 맞이합니다.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-basalt">상대리 마을회장</span>
              <span className="grid h-12 w-12 rotate-6 place-items-center rounded-md border-2 border-red-500 text-[10px] font-black leading-tight text-red-500">
                상대
                <br />
                마을회
              </span>
            </div>
          </div>
        </div>
      </article>

      <button
        onClick={() => {
          const text = `상대리 명예 주민증 ${no}${name ? ` · ${name}` : ''} · ${t.title}`;
          navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => setCopied(false));
        }}
        className="btn-dark mt-4 w-full"
      >
        <Copy size={18} /> {copied ? '주민증 정보를 복사했어요' : '주민증 정보 복사하기'}
      </button>
      <p className="mt-2 text-center text-[11px] text-stone-400">혜택은 시연용 예시예요.</p>
    </Modal>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-stone-400">{label}</div>
      <div className="text-lg font-black tabular-nums">
        {value}
        <span className="text-xs font-bold text-stone-400">{unit}</span>
      </div>
    </div>
  );
}
