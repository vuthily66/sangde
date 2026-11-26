import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FarmProduct } from '../types';
import { won } from '../utils';
import Durung from './Durung';
import Modal from './Modal';
import SeasonSummary from './SeasonSummary';
import { getAge, getVariety, treeMonthly } from '../data/trees';
import type { TreeChoice } from '../season';
import { CARE_MODES, FARMERS } from '../data/cultivation';
import type { CareMode } from '../types';
import { Check, Sprout, UserRound } from 'lucide-react';
import CropImage from './CropImage';

const SUGGESTIONS: Record<string, string[]> = {
  tangerine: ['귤동이', '새콤이', '한림 꿀귤', '탐라 오렌지'],
  cabbage: ['아삭이', '배추도사', '초록 동글이', '상대리 보물'],
};

interface Props {
  product: FarmProduct | null;
  tree?: TreeChoice;
  onClose: () => void;
  onConfirm: (nickname: string, careMode: CareMode) => void;
}

export default function NicknameModal({ product, tree, onClose, onConfirm }: Props) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<CareMode>('farmer');
  useEffect(() => {
    setName('');
    setMode('farmer');
  }, [product]);
  if (!product) return null;

  const trimmed = name.trim();
  const isOrange = product.accent === 'orange';

  return (
    <Modal open={!!product} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Durung size={88} mood="excited" className="animate-bob" />
          <CropImage crop={product.id} size={64} className="absolute -right-10 bottom-0 drop-shadow-lg" />
        </div>
        <h3 className="mt-3 text-xl font-extrabold">내 작물의 애칭을 지어주세요!</h3>
        <p className="mt-1 text-sm text-stone-500">
          {tree ? `${getVariety(tree.variety).name} · ${getAge(tree.age).label} · 월 ${won(treeMonthly(tree.variety, tree.age))}` : `${product.slot} · ${product.name} · 월 ${won(product.monthlyPrice)}`}
        </p>
      </div>
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onConfirm(trimmed, mode);
        }}
      >
        <input
          autoFocus
          value={name}
          maxLength={12}
          onChange={(e) => setName(e.target.value)}
          placeholder="예) 귤동이"
          className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3.5 text-lg font-bold outline-none transition focus:border-tangerine"
        />
        <div className="mt-1 text-right text-xs text-stone-400">{name.length}/12</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS[product.id].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setName(s)}
              className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-orange-100 hover:text-tangerine-dark"
            >
              {s}
            </button>
          ))}
        </div>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-bold">재배 방식 선택</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CARE_MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  aria-pressed={active}
                  className={`relative rounded-2xl border-2 p-3 text-left transition ${active ? 'border-cabbage bg-green-50' : 'border-stone-200 hover:border-stone-300'}`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {m.id === 'self' ? <Sprout size={16} className="text-cabbage" /> : <UserRound size={16} className="text-tangerine" />}
                    {m.title}
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-stone-500">{m.summary}</span>
                  <span className="mt-2 block text-xs font-bold tabular-nums">
                    월 {won((tree ? treeMonthly(tree.variety, tree.age) : product.monthlyPrice) - m.monthlyDiscount)}
                    {m.monthlyDiscount > 0 && <span className="ml-1 text-cabbage">(-{won(m.monthlyDiscount)})</span>}
                  </span>
                  {active && <Check size={16} strokeWidth={3} className="absolute right-3 top-3 text-cabbage" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
            어느 방식이든 담당 {FARMERS[product.id].name}({FARMERS[product.id].career})이 함께하고, 모든 작업은 재배 일지에 사진과 측정값으로 남아요.
          </p>
        </fieldset>
        <div className="mt-4">
          <SeasonSummary product={product} tree={tree} monthlyDiscount={CARE_MODES.find((m) => m.id === mode)!.monthlyDiscount} />
        </div>
        <div className="mt-3 rounded-2xl bg-cabbage-light/60 p-3 text-xs leading-relaxed text-cabbage-dark">
          🪧 지어준 이름은 상대리 실제 {product.id === 'tangerine' ? '감귤 나무' : '양배추 밭'}에 이름표로 걸려요.
        </div>
        <button type="submit" disabled={!trimmed} className={`${isOrange ? 'btn-orange' : 'btn-green'} mt-5 w-full py-4 text-base`}>
          <Sparkles size={18} />
          {trimmed ? `'${trimmed}' 분양 완료하고 농장 가기` : '애칭을 입력해 주세요'}
        </button>
      </form>
    </Modal>
  );
}
