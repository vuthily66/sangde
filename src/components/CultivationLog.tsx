import { Camera, CheckCircle2, ChevronDown, Circle, ClipboardCheck, Hand, MapPin, MessageCircle, Ruler, Send, UserRound, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CULTIVATION_TASKS, FARMER_REPLIES, FARMERS, getCareMode } from '../data/cultivation';
import { getProduct } from '../data/farmProducts';
import { getSchedule, taskDate, ymd } from '../season';
import type { CultivationTask, LogEntry, MyFarm } from '../types';
import { pick, shrinkPhoto } from '../utils';
import CropIllustration from './CropIllustration';
import Modal from './Modal';
import { GuideLink } from './GuideBook';
import type { GuideChapterId } from '../data/guide';

interface Props {
  farm: MyFarm;
  onAddEntry: (farmId: string, entry: LogEntry) => void;
  onUpdateEntry: (farmId: string, taskId: string, patch: (e: LogEntry) => LogEntry) => void;
  onOpenGuide?: (chapter: GuideChapterId) => void;
}

export default function CultivationLog({ farm, onAddEntry, onUpdateEntry, onOpenGuide }: Props) {
  const product = getProduct(farm.cropType);
  const mode = getCareMode(farm.careMode);
  const farmer = FARMERS[farm.cropType];
  const tasks = CULTIVATION_TASKS[farm.cropType];
  const log = farm.log ?? [];
  const sc = getSchedule(product, new Date(farm.adoptedAt), mode.monthlyDiscount);
  const nextTask = tasks[log.length] as CultivationTask | undefined;
  const myTurn = !!nextTask && mode.id === 'self' && nextTask.selfJoin;
  const [open, setOpen] = useState<string | null>(log[log.length - 1]?.taskId ?? null);
  const [camOpen, setCamOpen] = useState(false);
  const checkedCount = log.filter((e) => e.checked).length;

  const dateOf = (t: CultivationTask) => taskDate(sc.seasonStart, t.offset, t.day);

  const completeByFarmer = (t: CultivationTask) => {
    onAddEntry(farm.id, { taskId: t.id, by: 'farmer', at: dateOf(t).toISOString(), note: t.detail, checked: false, comments: [] });
    setOpen(t.id);
  };

  return (
    <div className="card p-5 md:p-6">
      {/* 헤더 */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">재배 일지</h3>
            <span className={`chip ${mode.id === 'self' ? 'bg-green-100 text-cabbage-dark' : 'bg-orange-100 text-tangerine-dark'}`}>
              {mode.id === 'self' ? <Hand size={12} /> : <UserRound size={12} />} {mode.title}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {mode.id === 'self'
              ? '손이 가는 핵심 작업은 직접 하고, 나머지는 담당 농부님이 기록을 남겨요.'
              : '담당 농부님이 작업할 때마다 사진과 측정값을 남겨요. 확인하고 궁금한 건 바로 물어보세요.'}
          </p>
          {onOpenGuide && farm.cropType === 'tangerine' && <GuideLink className="mt-2" onOpen={() => onOpenGuide('start')} />}
        </div>
        <button onClick={() => setCamOpen(true)} className="btn-ghost shrink-0 px-4 py-2 text-sm">
          <Video size={16} /> 밭 카메라 보기
        </button>
      </div>

      {/* 담당 농부 + 진행 현황 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-basalt text-sm font-bold text-white">
            {farmer.name.slice(0, 1)}
          </div>
          <div className="min-w-0 text-sm">
            <div className="font-bold">
              {farmer.name} <span className="font-medium text-stone-500">· {farmer.career}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500">
              <MapPin size={12} /> {farmer.plot}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-600">“{farmer.greeting}”</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-stone-50 p-3">
            <div className="text-[11px] font-semibold text-stone-500">완료한 작업</div>
            <div className="text-xl font-extrabold tabular-nums">
              {log.length}
              <span className="text-sm text-stone-400">/{tasks.length}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-stone-50 p-3">
            <div className="text-[11px] font-semibold text-stone-500">내가 확인함</div>
            <div className="text-xl font-extrabold tabular-nums text-cabbage">
              {checkedCount}
              <span className="text-sm text-stone-400">/{log.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 타임라인 */}
      <ol className="relative mt-6 space-y-3 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-0.5 before:bg-stone-200">
        {tasks.map((t, i) => {
          const entry = log.find((e) => e.taskId === t.id);
          const isNext = i === log.length;
          const mine = mode.id === 'self' && t.selfJoin;
          return (
            <li key={t.id} className="relative pl-10">
              <span className="absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full bg-white">
                {entry ? (
                  <CheckCircle2 size={22} className="text-cabbage" />
                ) : isNext ? (
                  <span className="h-4 w-4 animate-pulse rounded-full bg-tangerine ring-4 ring-orange-100" />
                ) : (
                  <Circle size={18} className="text-stone-300" />
                )}
              </span>
              <button
                onClick={() => entry && setOpen(open === t.id ? null : t.id)}
                disabled={!entry}
                className={`flex w-full items-start justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  entry ? 'bg-white ring-1 ring-stone-200 hover:ring-stone-300' : isNext ? 'bg-orange-50 ring-1 ring-orange-200' : 'bg-stone-50'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tabular-nums text-stone-400">{ymd(dateOf(t))}</span>
                  <span className={`block font-bold ${entry || isNext ? '' : 'text-stone-400'}`}>{t.title}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {mine ? (
                      <span className="chip bg-green-100 px-2 py-0.5 text-[10px] text-cabbage-dark">
                        <Hand size={10} /> 직접 작업
                      </span>
                    ) : (
                      <span className="chip bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                        <UserRound size={10} /> 농부님 작업
                      </span>
                    )}
                    {entry && (
                      <span className={`chip px-2 py-0.5 text-[10px] ${entry.checked ? 'bg-cabbage text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {entry.checked ? '확인 완료' : '확인 대기'}
                      </span>
                    )}
                    {entry && entry.comments.length > 0 && (
                      <span className="chip bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">
                        <MessageCircle size={10} /> {entry.comments.length}
                      </span>
                    )}
                  </span>
                </span>
                {entry && <ChevronDown size={18} className={`mt-2 shrink-0 text-stone-400 transition ${open === t.id ? 'rotate-180' : ''}`} />}
                {!entry && isNext && <span className="mt-2 shrink-0 text-xs font-bold text-tangerine">{myTurn ? '내 차례' : '다음 작업'}</span>}
              </button>
              {entry && open === t.id && (
                <EntryDetail
                  task={t}
                  entry={entry}
                  farm={farm}
                  plot={farmer.plot}
                  farmerName={farmer.name}
                  onUpdate={(patch) => onUpdateEntry(farm.id, t.id, patch)}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* 다음 작업 */}
      {nextTask ? (
        myTurn ? (
          <SelfTaskForm
            key={nextTask.id}
            task={nextTask}
            date={dateOf(nextTask)}
            onDone={(note, photo) => {
              onAddEntry(farm.id, { taskId: nextTask.id, by: 'me', at: dateOf(nextTask).toISOString(), note, photo, checked: true, comments: [] });
              setOpen(nextTask.id);
            }}
            onDelegate={() => completeByFarmer(nextTask)}
            onGuide={onOpenGuide && farm.cropType === 'tangerine' ? () => onOpenGuide('howto') : undefined}
          />
        ) : (
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-dashed border-stone-200 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-stone-600">
              다음 작업 <b>{nextTask.title}</b>은 {ymd(dateOf(nextTask))}에 {farmer.name}이 진행해요. 작업이 끝나면 일지에 기록이 올라와요.
            </p>
            <button onClick={() => completeByFarmer(nextTask)} className="btn-dark shrink-0 px-4 py-2 text-sm">
              <ClipboardCheck size={16} /> 시연: 작업 기록 받기
            </button>
          </div>
        )
      ) : (
        <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-cabbage-dark">
          이번 시즌 작업이 모두 끝났어요. 한 해 동안 함께 키워주셔서 고마워요!
        </p>
      )}

      <LiveCamModal open={camOpen} onClose={() => setCamOpen(false)} farm={farm} plot={farmer.plot} stage={tasks[Math.max(0, log.length - 1)].stage} />
    </div>
  );
}

function PhotoFrame({ farm, stage, date, plot, photo }: { farm: MyFarm; stage: CultivationTask['stage']; date: Date; plot: string; photo?: string }) {
  return (
    <figure className="relative overflow-hidden rounded-xl bg-stone-100">
      {photo ? (
        <img src={photo} alt="직접 올린 작업 사진" className="aspect-[300/220] w-full object-cover" />
      ) : (
        <div className="aspect-[300/220] w-full">
          <CropIllustration crop={farm.cropType} stage={stage} growth={stage === 'ready' ? 100 : stage === 'almost' ? 85 : stage === 'growing' ? 55 : 20} />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-[10px] font-semibold text-white">
        <span className="flex items-center gap-1">
          <Camera size={11} /> {ymd(date)} 09:40
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} /> {plot}
        </span>
      </figcaption>
      {!photo && <span className="absolute right-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white">예시 이미지</span>}
    </figure>
  );
}

function EntryDetail({
  task,
  entry,
  farm,
  plot,
  farmerName,
  onUpdate,
}: {
  task: CultivationTask;
  entry: LogEntry;
  farm: MyFarm;
  plot: string;
  farmerName: string;
  onUpdate: (patch: (e: LogEntry) => LogEntry) => void;
}) {
  const [text, setText] = useState('');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onUpdate((e) => ({ ...e, comments: [...e.comments, { by: 'me', text: t, at: new Date().toISOString() }] }));
    setText('');
    timer.current = window.setTimeout(() => {
      onUpdate((e) => ({ ...e, comments: [...e.comments, { by: 'farmer', text: pick(FARMER_REPLIES), at: new Date().toISOString() }] }));
    }, 1400);
  };

  return (
    <div className="mt-2 animate-pop rounded-2xl bg-stone-50 p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <PhotoFrame farm={farm} stage={task.stage} date={new Date(entry.at)} plot={plot} photo={entry.photo} />
        <div className="min-w-0 space-y-3 text-sm">
          <div>
            <div className="text-[11px] font-bold text-stone-400">작업자</div>
            <div className="font-semibold">{entry.by === 'me' ? '나 (직접 작업 인증)' : farmerName}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-400">작업 기록</div>
            <p className="leading-relaxed text-stone-700">{entry.note}</p>
          </div>
          {task.metric && entry.by === 'farmer' && (
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-stone-200">
              <Ruler size={15} className="text-tangerine" />
              <span className="font-bold tabular-nums">{task.metric}</span>
            </div>
          )}
          {!entry.checked ? (
            <button onClick={() => onUpdate((e) => ({ ...e, checked: true }))} className="btn-green w-full py-2.5 text-sm">
              <CheckCircle2 size={16} /> 기록 확인했어요
            </button>
          ) : (
            <p className="flex items-center gap-1 text-xs font-semibold text-cabbage">
              <CheckCircle2 size={14} /> 확인한 기록이에요
            </p>
          )}
        </div>
      </div>

      {/* 댓글 */}
      <div className="mt-4 space-y-2 border-t border-stone-200 pt-3">
        {entry.comments.map((c, i) => (
          <div key={i} className={`flex ${c.by === 'me' ? 'justify-end' : 'justify-start'}`}>
            <span className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${c.by === 'me' ? 'bg-basalt text-white' : 'bg-white ring-1 ring-stone-200'}`}>
              {c.by === 'farmer' && <b className="mb-0.5 block text-[11px] text-tangerine">{farmerName}</b>}
              {c.text}
            </span>
          </div>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label htmlFor={`comment-${task.id}`} className="sr-only">
            농부님께 질문 남기기
          </label>
          <input
            id={`comment-${task.id}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="농부님께 궁금한 점을 남겨보세요"
            className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-tangerine"
          />
          <button type="submit" disabled={!text.trim()} className="btn-dark px-3 py-2" aria-label="보내기">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function SelfTaskForm({
  task,
  date,
  onDone,
  onDelegate,
  onGuide,
}: {
  task: CultivationTask;
  date: Date;
  onDone: (note: string, photo?: string) => void;
  onDelegate: () => void;
  onGuide?: () => void;
}) {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState('');

  return (
    <div className="mt-5 rounded-2xl border-2 border-cabbage bg-green-50/60 p-4">
      <div className="flex items-center gap-2 font-bold text-cabbage-dark">
        <Hand size={18} /> 내 차례: {task.title}
      </div>
      <p className="mt-1 text-sm text-stone-600">
        {ymd(date)} 전후로 상대리에 방문해 직접 작업해 주세요. 작업을 마치면 사진과 한 줄 기록으로 인증하면 돼요.
      </p>
      {onGuide && <GuideLink className="mt-1" label={`${task.title} 방법 보기`} onOpen={onGuide} />}
      <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
        <label className="grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-cabbage/40 bg-white text-center text-xs font-semibold text-cabbage hover:bg-green-50">
          {photo ? (
            <img src={photo} alt="업로드한 작업 사진" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1">
              <Camera size={20} /> 작업 사진 올리기
            </span>
          )}
          <input
            id={`photo-${task.id}`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                setPhoto(await shrinkPhoto(f));
                setError('');
              } catch {
                setError('사진을 읽지 못했어요. JPG나 PNG 파일로 다시 올려주세요.');
              }
            }}
          />
        </label>
        <div className="flex flex-col gap-2">
          <label htmlFor={`note-${task.id}`} className="sr-only">
            작업 기록
          </label>
          <textarea
            id={`note-${task.id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={`예) ${task.detail}`}
            className="w-full flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-cabbage"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onDone(note.trim() || task.detail, photo)} className="btn-green px-4 py-2 text-sm">
              <CheckCircle2 size={16} /> 작업 완료 인증
            </button>
            <button onClick={onDelegate} className="btn-ghost px-4 py-2 text-sm">
              이번엔 농부님께 맡기기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveCamModal({ open, onClose, farm, plot, stage }: { open: boolean; onClose: () => void; farm: MyFarm; plot: string; stage: CultivationTask['stage'] }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [open]);
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-xl">
      <h3 className="pr-8 text-lg font-extrabold">{farm.nickname} 밭 카메라</h3>
      <p className="text-sm text-stone-500">{plot}에 설치된 카메라 화면이에요.</p>
      <div className="relative mt-4 overflow-hidden rounded-2xl">
        <div className="aspect-[300/220] w-full">
          <CropIllustration crop={farm.cropType} stage={stage} growth={stage === 'ready' ? 100 : stage === 'almost' ? 85 : stage === 'growing' ? 55 : 20} />
        </div>
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
        </span>
        <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 font-mono text-[11px] text-white tabular-nums">
          {ymd(now)} {now.toTimeString().slice(0, 8)}
        </span>
      </div>
      <p className="mt-3 text-xs text-stone-400">시연용 예시 화면입니다. 실제 서비스에서는 밭 카메라 영상이 연결돼요.</p>
    </Modal>
  );
}
