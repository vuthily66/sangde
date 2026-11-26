import { AlertTriangle, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import {
  CARE_TABLE,
  FAQ,
  GUIDE_CHAPTERS,
  HOWTO,
  MONTHS,
  PREP,
  PROOF_TIPS,
  WEATHER_TIPS,
  YOUNG_TREE,
  type GuideChapterId,
} from '../data/guide';
import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  start?: GuideChapterId;
}

/** 직접 키우기 가이드북 */
export default function GuideBook({ open, onClose, start = 'start' }: Props) {
  const [ch, setCh] = useState<GuideChapterId>(start);
  useEffect(() => {
    if (open) setCh(start);
  }, [open, start]);
  const idx = GUIDE_CHAPTERS.findIndex((c) => c.id === ch);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-4xl">
      <div className="flex items-center gap-2 pr-8">
        <BookOpen size={20} className="text-tangerine" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tangerine">Guide Book</p>
          <h2 className="text-xl font-extrabold">내 감귤나무 직접 키우기 가이드북</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[170px_1fr]">
        {/* 목차 */}
        <nav aria-label="가이드북 목차" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
          {GUIDE_CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCh(c.id)}
              aria-current={ch === c.id ? 'page' : undefined}
              className={`shrink-0 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                ch === c.id ? 'bg-basalt text-white' : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <span aria-hidden="true" className="mr-1.5 text-xs opacity-60 tabular-nums">{i + 1}</span>
              {c.label}
            </button>
          ))}
        </nav>

        {/* 본문 */}
        <div key={ch} className="min-w-0 animate-pop text-sm leading-relaxed text-stone-700">
          {ch === 'start' && (
            <div className="space-y-5">
              <p>
                직접 키우기를 고르면 <b>가지치기 · 열매 솎기 · 태풍 대비 · 수확</b>은 상대리에 와서 직접 하고, 나머지 평소 관리는 담당 농부님이 도와드려요.
              </p>
              <Block title="챙겨 오면 좋은 것">
                <List items={PREP.tools} />
              </Block>
              <Block title="방문하는 날">
                <List items={PREP.visit} numbered />
              </Block>
              <Block title="밭에서 꼭 지켜요" warn>
                <List items={PREP.rules} />
              </Block>
            </div>
          )}

          {ch === 'calendar' && (
            <div className="space-y-3">
              <p>감귤나무의 1년이에요. <b className="text-cabbage">초록 표시</b>가 직접 오셔서 하는 작업이에요.</p>
              <ol className="divide-y divide-stone-100 overflow-hidden rounded-2xl ring-1 ring-stone-200">
                {MONTHS.map((m) => (
                  <li key={m.month} className={`flex items-start gap-3 px-4 py-3 ${m.me ? 'bg-green-50/60' : 'bg-white'}`}>
                    <span className="w-16 shrink-0 font-extrabold tabular-nums">{m.month}</span>
                    <span className="min-w-0 flex-1">{m.todo}</span>
                    {m.me && <span className="chip shrink-0 bg-cabbage px-2 py-0.5 text-[10px] text-white">직접</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {ch === 'howto' && (
            <div className="space-y-4">
              {HOWTO.map((h) => (
                <details key={h.title} className="group rounded-2xl ring-1 ring-stone-200 open:bg-stone-50/60" open={h.title === '봄 가지치기'}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                    <span>
                      <span className="block font-extrabold text-basalt">{h.title}</span>
                      <span className="text-xs text-stone-500">{h.when}</span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-stone-400 transition group-open:rotate-90" />
                  </summary>
                  <div className="space-y-3 px-4 pb-4">
                    <p className="flex flex-wrap items-center gap-1.5 text-xs">
                      <Wrench size={13} className="text-stone-400" />
                      {h.tools.map((t) => (
                        <span key={t} className="rounded-full bg-white px-2 py-0.5 ring-1 ring-stone-200">
                          {t}
                        </span>
                      ))}
                    </p>
                    <List items={h.steps} numbered />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl bg-green-50 p-3 text-xs text-green-900">
                        <b className="mb-1 flex items-center gap-1">
                          <CheckCircle2 size={13} /> 다 했다면 확인
                        </b>
                        <List items={h.check} />
                      </div>
                      <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800">
                        <b className="mb-1 flex items-center gap-1">
                          <AlertTriangle size={13} /> 자주 하는 실수
                        </b>
                        <List items={h.mistakes} />
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {ch === 'care' && (
            <div className="space-y-5">
              <p>'키우기 계획'에서 고르는 비료와 물의 기본 원칙이에요. 날씨 예보가 있으면 조금씩 바꿔요.</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-xs text-stone-500">
                    <tr>
                      <th className="py-2 pr-3">계절</th>
                      <th className="py-2 pr-3">비료</th>
                      <th className="py-2 pr-3">물</th>
                      <th className="py-2">이유</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {CARE_TABLE.map((r) => (
                      <tr key={r.season}>
                        <td className="py-2.5 pr-3 font-extrabold">{r.season}</td>
                        <td className="py-2.5 pr-3 font-semibold text-cabbage-dark">{r.fert}</td>
                        <td className="py-2.5 pr-3 font-semibold text-sky-700">{r.water}</td>
                        <td className="py-2.5 text-stone-600">{r.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Block title="날씨에 따라 바꾸기">
                <ul className="space-y-1.5">
                  {WEATHER_TIPS.map((w) => (
                    <li key={w.w}>
                      <b>{w.w}</b> · {w.tip}
                    </li>
                  ))}
                </ul>
              </Block>
            </div>
          )}

          {ch === 'young' && (
            <div className="space-y-4">
              <p>1년차·2년차로 시작했다면 첫 수확 전까지는 열매보다 <b>나무를 튼튼하게 키우는 것</b>이 목표예요.</p>
              <List items={YOUNG_TREE} numbered />
            </div>
          )}

          {ch === 'proof' && (
            <div className="space-y-4">
              <p>직접 한 작업은 사진으로 인증해 재배 일지에 남겨요. 담당 농부님이 확인하고 조언을 달아드려요.</p>
              <List items={PROOF_TIPS} numbered />
            </div>
          )}

          {ch === 'faq' && (
            <dl className="space-y-3">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl bg-stone-50 p-4">
                  <dt className="font-extrabold text-basalt">Q. {f.q}</dt>
                  <dd className="mt-1">{f.a}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* 이전·다음 */}
          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
            <button
              disabled={idx === 0}
              onClick={() => setCh(GUIDE_CHAPTERS[idx - 1].id)}
              className="flex items-center gap-1 text-sm font-semibold text-stone-500 hover:text-basalt disabled:invisible"
            >
              <ChevronLeft size={16} /> {idx > 0 && GUIDE_CHAPTERS[idx - 1].label}
            </button>
            <button
              disabled={idx === GUIDE_CHAPTERS.length - 1}
              onClick={() => setCh(GUIDE_CHAPTERS[idx + 1].id)}
              className="flex items-center gap-1 text-sm font-semibold text-tangerine hover:text-tangerine-dark disabled:invisible"
            >
              {idx < GUIDE_CHAPTERS.length - 1 && GUIDE_CHAPTERS[idx + 1].label} <ChevronRight size={16} />
            </button>
          </div>
          <p className="mt-3 text-[11px] text-stone-400">일반적인 감귤 재배 방법을 정리한 안내예요. 실제 작업은 담당 농부님 설명을 따라 주세요.</p>
        </div>
      </div>
    </Modal>
  );
}

function Block({ title, children, warn }: { title: string; children: ReactNode; warn?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${warn ? 'bg-amber-50 text-amber-900' : 'bg-stone-50'}`}>
      <h3 className="mb-2 font-extrabold">{title}</h3>
      {children}
    </div>
  );
}

function List({ items, numbered }: { items: string[]; numbered?: boolean }) {
  return numbered ? (
    <ol className="space-y-1.5">
      {items.map((t, i) => (
        <li key={t} className="flex gap-2">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tangerine text-[11px] font-bold text-white">{i + 1}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  ) : (
    <ul className="space-y-1">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** 작은 글씨 링크 */
export function GuideLink({ onOpen, label = '직접 키우기 가이드북 보기', className = '' }: { onOpen: () => void; label?: string; className?: string }) {
  return (
    <button onClick={onOpen} className={`inline-flex items-center gap-1 text-xs font-semibold text-stone-500 underline decoration-stone-300 underline-offset-4 hover:text-tangerine hover:decoration-tangerine ${className}`}>
      <BookOpen size={12} /> {label} →
    </button>
  );
}
