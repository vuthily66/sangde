import { Award, Camera, CalendarCheck, Check, Lock, MapPin, Ticket } from 'lucide-react';
import { useState } from 'react';
import { STAMP_MISSIONS, VISIT_BENEFITS } from '../data/travel';
import type { MyFarm, RunRecord, VisitBenefit } from '../types';
import CertificateModal from './CertificateModal';
import DurungBubble from './DurungBubble';
import Modal from './Modal';
import { shrinkPhoto } from '../utils';
import VillageExplore from './VillageExplore';
import { getProduct } from '../data/farmProducts';
import { dayLabel, farmSchedule, getSchedule, harvestSlots } from '../season';

interface Props {
  farms: MyFarm[];
  stamps: string[];
  reservedBenefits: string[];
  certificateIssuedAt: string | null;
  onStamp: (id: string, photo: string) => void;
  stampPhotos: Record<string, string>;
  residentPhoto: string | null;
  onResidentPhoto: (photo: string | null) => void;
  onReserve: (id: string, detail: string) => void;
  runs: RunRecord[];
  onRun: (record: RunRecord) => void;
  onIssueCertificate: () => void;
  onGoRental: () => void;
}


export default function TravelPage({ farms, stamps, reservedBenefits, certificateIssuedAt, onStamp, onReserve, onIssueCertificate, onGoRental, runs, onRun, stampPhotos, residentPhoto, onResidentPhoto }: Props) {
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [justStamped, setJustStamped] = useState<string | null>(null);
  const [certOpen, setCertOpen] = useState(false);
  const [benefit, setBenefit] = useState<VisitBenefit | null>(null);
  // 수확 체험은 내 작물(없으면 감귤)의 실제 수확 기간 중 토요일에만 열려요
  const slotSource = farms.length ? farms : [{ cropType: 'tangerine' as const, adoptedAt: new Date().toISOString() }];
  const SLOTS = slotSource
    .flatMap((f) => {
      const sc = 'id' in f ? farmSchedule(f) : getSchedule(getProduct(f.cropType), new Date(f.adoptedAt));
      return harvestSlots(sc.harvestStart, sc.harvestEnd, 3).map((d) => ({ d, crop: f.cropType }));
    })
    .sort((a, b) => a.d.getTime() - b.d.getTime())
    .slice(0, 4)
    .map(({ d, crop }, i) => `${dayLabel(d)} ${i % 2 ? '14:00' : '10:00'} · ${crop === 'tangerine' ? '감귤 따기' : '양배추 수확'}`);
  const [slot, setSlot] = useState(SLOTS[0]);
  const isMember = farms.length > 0;
  const complete = stamps.length === STAMP_MISSIONS.length;

  const handleStamp = async (id: string, file?: File) => {
    if (!file) return;
    let photo: string;
    try {
      photo = await shrinkPhoto(file);
      setPhotoError(null);
    } catch {
      setPhotoError('사진을 읽지 못했어요. JPG나 PNG 사진으로 다시 올려주세요.');
      return;
    }
    const isNew = !stamps.includes(id);
    onStamp(id, photo);
    if (!isNew) return;
    setJustStamped(id);
    setTimeout(() => setJustStamped(null), 700);
    if (stamps.length + 1 === STAMP_MISSIONS.length) {
      setTimeout(() => {
        onIssueCertificate();
        setCertOpen(true);
      }, 900);
    }
  };

  const msg = complete
    ? '스탬프 3개 완성! 이제 너도 상대리 명예 주민이야 🏅 주민증을 받아봐!'
    : `상대리 곳곳을 돌며 스탬프를 모아봐! 3개를 다 모으면 상대리 명예 주민증를 줄게 (${stamps.length}/3)`;

  return (
    <div className="space-y-10">
      <div>
        <span className="text-sm font-bold text-cabbage">VILLAGE TRAVEL & MARKET</span>
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">상대리 마을 여행 & 스탬프 패스포트</h2>
        <p className="mt-1 flex items-center gap-1 text-stone-500"><MapPin size={14} /> 제주시 한림읍 상대리 · 제주공항에서 차로 40분</p>
      </div>

      {/* 방문 혜택 */}
      <section>
        <h3 className="mb-3 text-lg font-extrabold">🎟️ 분양 고객 전용 방문 혜택</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {VISIT_BENEFITS.map((b) => {
            const done = reservedBenefits.includes(b.id);
            return (
              <div key={b.id} className="card relative flex gap-4 overflow-hidden p-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-tangerine-light text-4xl">{b.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-extrabold">{b.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{b.description}</p>
                  <button
                    disabled={!isMember}
                    onClick={() => {
                      setBenefit(b);
                      setSlot(SLOTS[0]);
                    }}
                    className={`mt-3 px-4 py-2 text-sm ${done ? 'btn-ghost' : 'btn-dark'}`}
                  >
                    {done ? <><Check size={15} /> {b.kind === 'coupon' ? '쿠폰 보기' : '예약 확인'}</> : <>{b.kind === 'coupon' ? <Ticket size={15} /> : <CalendarCheck size={15} />} {b.cta}</>}
                  </button>
                </div>
                {!isMember && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-[2px]">
                    <Lock size={22} className="text-stone-500" />
                    <p className="text-sm font-semibold text-stone-600">농장 분양 고객 전용 혜택이에요</p>
                    <button onClick={onGoRental} className="btn-orange px-4 py-2 text-sm">분양받으러 가기</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <VillageExplore isMember={isMember} reserved={reservedBenefits} runs={runs} onReserve={onReserve} onRun={onRun} />

      {/* 스탬프 */}
      <section className="overflow-hidden rounded-[2rem] basalt-wall p-6 text-white md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-extrabold">🗺️ 상대리 마을 투어 스탬프 미션</h3>
            <p className="text-sm text-slate-300">현장에서 인증샷을 찍어 올리면 도장이 찍혀요. 세 곳을 다 모으면 명예 주민증이 나와요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-32 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-tangerine transition-all duration-500" style={{ width: `${(stamps.length / 3) * 100}%` }} />
            </div>
            <span className="font-bold">{stamps.length}/3</span>
          </div>
        </div>
        <DurungBubble tone="dark" message={msg} mood={complete ? 'excited' : 'wink'} size={64} className="mt-5" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STAMP_MISSIONS.map((m, i) => {
            const got = stamps.includes(m.id);
            return (
              <label
                key={m.id}
                className={`group relative block cursor-pointer overflow-hidden rounded-3xl text-left transition focus-within:ring-2 focus-within:ring-orange-300 ${
                  got ? 'bg-white text-basalt' : 'bg-white/5 ring-1 ring-white/15 hover:bg-white/10 hover:-translate-y-1'
                } ${justStamped === m.id ? 'scale-[1.03]' : ''}`}
              >
                <input
                  id={`stamp-photo-${m.id}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-label={`${m.title} 인증샷 올리기`}
                  onChange={(e) => {
                    handleStamp(m.id, e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
                {/* 인증샷 */}
                {stampPhotos[m.id] ? (
                  <div className="relative aspect-[4/3] w-full">
                    <img src={stampPhotos[m.id]} alt={`${m.title} 인증샷`} className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      <Camera size={11} className="mr-1 inline" />
                      다시 찍기
                    </span>
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center border-b border-dashed border-white/20 text-center text-white/70 group-hover:text-orange-200">
                    <span className="flex flex-col items-center gap-1.5">
                      <Camera size={30} />
                      <span className="text-sm font-bold">인증샷 찍고 도장 받기</span>
                      <span className="text-[11px] text-white/50">사진을 올리면 도장이 찍혀요</span>
                    </span>
                  </div>
                )}
                <div className="p-5 pt-4">
                  <span className={`text-[11px] font-bold ${got ? 'text-tangerine' : 'text-orange-300'}`}>MISSION {i + 1}</span>
                  <h4 className="mt-0.5 font-extrabold">
                    {m.emoji} {m.title}
                  </h4>
                  <p className={`text-xs ${got ? 'text-stone-500' : 'text-slate-400'}`}>{m.location}</p>
                  <p className={`mt-2 text-sm ${got ? 'text-stone-600' : 'text-slate-300'}`}>{m.description}</p>
                </div>
                {/* 도장 */}
                {got && (
                  <div className={`absolute right-3 top-3 grid h-20 w-20 -rotate-12 place-items-center rounded-full border-[3px] border-double border-red-500 bg-white/85 text-center text-red-500 ${justStamped === m.id ? 'animate-stamp-in' : ''}`}>
                    <div className="leading-tight">
                      <div className="text-[9px] font-bold">SANGDAE-RI</div>
                      <div className="text-sm font-black">참 잘했어요</div>
                      <div className="text-[9px] font-bold">{m.emoji} VISITED</div>
                    </div>
                  </div>
                )}
              </label>
            );
          })}
        </div>
        {photoError && <p className="mt-4 rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-200">{photoError}</p>}
        {complete && (
          <button onClick={() => setCertOpen(true)} className="btn-orange mt-6 w-full sm:w-auto">
            <Award size={18} /> 명예 주민증 보기
          </button>
        )}
      </section>

      <CertificateModal open={certOpen} onClose={() => setCertOpen(false)} farms={farms} issuedAt={certificateIssuedAt} stamps={stamps} runs={runs} stampPhotos={stampPhotos} residentPhoto={residentPhoto} onResidentPhoto={onResidentPhoto} />

      {/* 혜택 상세 모달 */}
      <Modal open={!!benefit} onClose={() => setBenefit(null)}>
        {benefit && (
          <div className="text-center">
            <div className="text-5xl">{benefit.emoji}</div>
            <h3 className="mt-2 text-xl font-extrabold">{benefit.title}</h3>
            {benefit.kind === 'coupon' ? (
              <>
                <div className="mx-auto mt-5 max-w-xs rounded-2xl border-2 border-dashed border-tangerine bg-orange-50 p-5">
                  <div className="text-xs font-bold text-tangerine">감귤 창고 카페 · 음료 1잔 무료</div>
                  <div className="mt-2 font-mono text-2xl font-black tracking-widest">SDR-{(farms[0]?.id ?? 'GUEST').slice(-4).toUpperCase()}-CAFE</div>
                  <div className="mt-2 text-[11px] text-stone-500">유효기간: 발급일로부터 90일</div>
                </div>
                <button
                  onClick={() => {
                    onReserve(benefit.id, '음료 쿠폰이 발급되었어요! 카페 직원에게 보여주세요 🥤');
                    setBenefit(null);
                  }}
                  className="btn-orange mt-5 w-full"
                >
                  쿠폰함에 저장
                </button>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-stone-500">내 작물의 실제 수확 기간 중 토요일에 열려요 (최대 4인)</p>
                <div className="mt-4 space-y-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 font-semibold ${slot === s ? 'border-cabbage bg-green-50' : 'border-stone-200'}`}
                    >
                      {s}
                      {slot === s && <Check size={18} className="text-cabbage" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onReserve(benefit.id, `${slot} 체험이 예약되었어요! 🧺`);
                    setBenefit(null);
                  }}
                  className="btn-green mt-5 w-full"
                >
                  예약 확정하기
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
