import { Home, MapPin, ShoppingBasket } from 'lucide-react';
import { VILLAGE_QUERY, kakaoSearchUrl } from '../data/explore';
import type { TabId } from '../types';
import VillageBadge from './VillageBadge';

const MENU: { id: TabId; label: string }[] = [
  { id: 'rental', label: '상대로운' },
  { id: 'farm', label: '내 농장' },
  { id: 'shop', label: '장터' },
  { id: 'travel', label: '마을 여행' },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  cartCount: number;
  overlay: boolean; // 홈 슬라이드 위에서는 배경 없이
}

/** 데스크톱 왼쪽 세로 메뉴 */
export default function Sidebar({ active, onChange, cartCount, overlay }: Props) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between px-10 pb-8 pt-12 text-white transition-colors duration-500 md:flex ${
        overlay ? 'bg-transparent' : 'bg-[#1b211d]'
      }`}
    >
      <div>
        <nav aria-label="주 메뉴">
          <ul className="space-y-3">
            {MENU.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onChange(m.id)}
                  aria-current={active === m.id ? 'page' : undefined}
                  className={`group flex items-center gap-2 text-[1.7rem] font-medium tracking-tight transition ${
                    active === m.id ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {m.label}
                  {active === m.id && <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />}
                  {m.id === 'market' && cartCount > 0 && (
                    <span className="rounded-full bg-tangerine px-1.5 text-[11px] font-bold text-white">{cartCount}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="my-6 h-px w-32 bg-white/50" />
        <ul className="flex flex-col gap-4 text-white/85">
          <li>
            <a href={kakaoSearchUrl(VILLAGE_QUERY)} target="_blank" rel="noopener noreferrer" aria-label="카카오맵에서 상대리 보기" className="hover:text-white">
              <MapPin size={20} />
            </a>
          </li>
          <li>
            <button onClick={() => onChange('shop')} aria-label="장터" className="hover:text-white">
              <ShoppingBasket size={20} />
            </button>
          </li>
          <li>
            <button onClick={() => onChange('rental')} aria-label="처음으로" className="hover:text-white">
              <Home size={20} />
            </button>
          </li>
        </ul>
      </div>

      <div className="text-[11px] leading-relaxed text-white/75">
        <VillageBadge size={84} />
        <div className="mt-5 inline-block border-b border-white/60 pb-1 text-xs font-black tracking-wide text-white">SANGDAE FARM</div>
        <p className="mt-2">
          Sangdae-ri, Hallim-eup, Jeju-si
          <br />
          제주특별자치도 제주시 한림읍 상대리
        </p>
        <p className="mt-3 text-white/55">시연용 프로토타입 · © 상대로운</p>
      </div>
    </aside>
  );
}
