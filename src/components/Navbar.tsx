import { Map, ShoppingBag, Sprout, Store } from 'lucide-react';
import type { TabId } from '../types';

const TABS: { id: TabId; label: string; short: string; icon: typeof Sprout }[] = [
  { id: 'rental', label: '농장 분양소', short: '분양', icon: Store },
  { id: 'farm', label: '내 농장', short: '내 농장', icon: Sprout },
  { id: 'shop', label: '장터', short: '장터', icon: ShoppingBag },
  { id: 'travel', label: '마을 여행', short: '여행', icon: Map },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  cartCount: number;
  hasFarm: boolean;
  stampCount: number;
  overlay?: boolean; // 히어로 위에서 투명하게
}

export default function Navbar({ active, onChange, cartCount, hasFarm, stampCount, overlay = false }: Props) {
  const badge = (id: TabId) => {
    if (id === 'market' && cartCount > 0) return cartCount;
    if (id === 'farm' && hasFarm) return '●';
    if (id === 'travel' && stampCount > 0) return `${stampCount}/3`;
    return null;
  };

  return (
    <>
      {/* 상단 바 */}
      <header className={`top-[env(safe-area-inset-top,0px)] z-40 border-b transition-colors duration-300 md:hidden ${overlay ? 'absolute inset-x-0 border-transparent bg-transparent text-white' : 'sticky border-stone-200/70 bg-ivory/90 text-basalt backdrop-blur'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={() => onChange('rental')} className="flex items-center gap-2">
            <span className="text-left leading-tight">
              <span className="block font-brush text-3xl leading-none">상대로운</span>
              <span className={`block text-[11px] font-semibold ${overlay ? 'text-white/80' : 'text-cabbage'}`}>상대로운 · 한림 상대리</span>
            </span>
          </button>
          <nav className="hidden gap-1 md:flex">
            {TABS.map(({ id, label, icon: Icon }) => {
              const b = badge(id);
              return (
                <button
                  key={id}
                  onClick={() => onChange(id)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active === id ? (overlay ? 'bg-white text-basalt' : 'bg-basalt text-white') : overlay ? 'text-white/90 hover:bg-white/15' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {b !== null && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 text-[10px] font-bold ${
                        b === '●' ? 'text-cabbage' : 'bg-tangerine text-white'
                      }`}
                    >
                      {b}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 모바일 하단 탭바 */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {TABS.map(({ id, short, icon: Icon }) => {
          const b = badge(id);
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                active === id ? 'text-tangerine' : 'text-stone-500'
              }`}
            >
              <Icon size={20} strokeWidth={active === id ? 2.5 : 2} />
              {short}
              {b !== null && b !== '●' && (
                <span className="absolute right-[22%] top-1 rounded-full bg-tangerine px-1.5 text-[9px] font-bold text-white">
                  {b}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
