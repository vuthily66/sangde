import { ExternalLink, Info, Minus, Plus, ShoppingBag, Store, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import fieldSky from '../assets/photos/field-sky.webp';
import { CHANNELS, SHOP_CATEGORIES, SHOP_PRODUCTS, buyUrl, discountRate, type Channel, type ChannelId, type ShopProduct } from '../data/shop';
import { won } from '../utils';
import Modal from './Modal';

interface Props {
  onOrder: (message: string) => void;
}

type Sort = 'recommend' | 'low' | 'discount';

/** 상대로운 장터 (농산물 판매) */
export default function ShopPage({ onOrder }: Props) {
  const [channelId, setChannelId] = useState<ChannelId>(() => {
    try {
      return (localStorage.getItem('sangdaeroun-channel') as ChannelId) || 'naver';
    } catch {
      return 'naver';
    }
  });
  const [cat, setCat] = useState<(typeof SHOP_CATEGORIES)[number]>('전체');
  const [sort, setSort] = useState<Sort>('recommend');
  const [detail, setDetail] = useState<ShopProduct | null>(null);
  const channel = CHANNELS.find((c) => c.id === channelId)!;

  const pickChannel = (id: ChannelId) => {
    setChannelId(id);
    try {
      localStorage.setItem('sangdaeroun-channel', id);
    } catch {
      /* 저장 못 해도 동작 */
    }
  };

  const list = useMemo(() => {
    const l = SHOP_PRODUCTS.filter((p) => cat === '전체' || p.category === cat);
    if (sort === 'low') return [...l].sort((a, b) => a.salePrice - b.salePrice);
    if (sort === 'discount') return [...l].sort((a, b) => discountRate(b) - discountRate(a));
    return l;
  }, [cat, sort]);

  return (
    <div className="space-y-6">
      {/* 브랜드 배너 */}
      <section className="relative -mx-4 -mt-6 overflow-hidden text-white md:mx-0 md:mt-0 md:rounded-3xl">
        <img src={fieldSky} alt="상대리 겨울 들녘" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '50% 58%' }} />
        {/* 사진이 잘 보이도록 위는 밝게, 글자가 있는 아래만 어둡게 */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/80 via-black/45 to-transparent md:h-[62%]" />
        <div className="relative flex min-h-[520px] flex-col justify-end gap-6 p-6 pt-24 md:min-h-[600px] md:p-10">
          <div className="flex items-center gap-4">
            <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-basalt shadow-lg sm:grid">
              <span className="font-brush text-2xl leading-none">상대</span>
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300">Sangdae Market</p>
              <h2 className="text-4xl font-black tracking-tight drop-shadow-lg md:text-6xl">상대로운 장터</h2>
              <p className="mt-2 text-base text-white/90 drop-shadow md:text-lg">한림 상대리 겨울 밭에서 수확한 채소를 바로 보내드려요</p>
            </div>
          </div>

          {/* 판매처 선택 */}
          <div className="rounded-3xl bg-black/30 p-3 ring-1 ring-white/15 backdrop-blur-md md:p-4">
            <div className="mb-2 px-1 text-xs font-bold text-white/85">어디서 구매할까요?</div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="판매처 선택">
              {CHANNELS.map((c) => {
                const on = c.id === channelId;
                return (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={on}
                    onClick={() => pickChannel(c.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 text-center transition sm:flex-row sm:gap-3 sm:px-4 sm:py-3 sm:text-left ${on ? 'bg-white text-basalt shadow-lg' : 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20'}`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${on ? 'bg-tangerine text-white' : 'bg-white/15'}`}>
                      {c.id === 'app' ? <ShoppingBag size={18} /> : <Store size={18} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-extrabold sm:text-sm">
                        <span className="sm:hidden">{c.short}</span>
                        <span className="hidden sm:inline">{c.name}</span>
                      </span>
                      <span className={`hidden text-[11px] sm:block ${on ? 'text-stone-500' : 'text-white/70'}`}>
                        {c.id !== 'app' && !c.storeUrl ? '주소 연결 준비 중' : c.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 배송 안내 줄 */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-stone-200">
        <span className="flex items-center gap-1.5 font-semibold">
          <Truck size={16} className="text-cabbage" /> 수확 후 48시간 안에 산지 직송
        </span>
        <span className="text-stone-500">3만 원 이상 무료배송</span>
        <span className="text-stone-500">월·화·수 수확 · 출고</span>
      </div>

      {/* 카테고리 + 정렬 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200">
        <div className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
          {SHOP_CATEGORIES.map((c) => {
            const count = c === '전체' ? SHOP_PRODUCTS.length : SHOP_PRODUCTS.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 border-b-2 px-3 py-3 text-sm font-bold transition ${cat === c ? 'border-basalt text-basalt' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
              >
                {c} <span className="text-xs font-semibold text-stone-400">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="mb-2 flex items-center gap-2 text-xs text-stone-500">
          정렬
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-semibold text-basalt"
          >
            <option value="recommend">추천순</option>
            <option value="low">낮은 가격순</option>
            <option value="discount">할인율순</option>
          </select>
        </label>
      </div>

      {/* 상품 목록 */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {list.map((p) => (
          <li key={p.id}>
            <ProductTile product={p} channel={channel} onOpen={() => setDetail(p)} />
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-1.5 text-xs text-stone-400">
        <Info size={13} /> 가격과 구성은 시연용 예시예요. 판매처 주소를 연결하면 구매 버튼이 해당 스토어로 바로 이동해요.
      </p>

      <ProductModal product={detail} channel={channel} onClose={() => setDetail(null)} onOrder={onOrder} />
    </div>
  );
}

function Thumb({ product, className = '' }: { product: ShopProduct; className?: string }) {
  const bg: Record<string, string> = {
    양배추: 'from-lime-50 to-green-100',
    브로콜리: 'from-emerald-50 to-green-100',
    비트: 'from-rose-50 to-pink-100',
    콜라비: 'from-violet-50 to-purple-100',
    꾸러미: 'from-amber-50 to-orange-100',
  };
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${bg[product.category]} ${className}`}>
      {product.images.length > 1 ? (
        <div className="grid h-full w-full grid-cols-2 gap-0.5">
          {product.images.map((src, i) => (
            <img key={i} src={src} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
      ) : (
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      )}
    </div>
  );
}

function ProductTile({ product: p, channel, onOpen }: { product: ShopProduct; channel: Channel; onOpen: () => void }) {
  const url = buyUrl(p, channel);
  return (
    <article className="group flex h-full flex-col">
      <button onClick={onOpen} className="text-left" aria-label={`${p.name} 자세히 보기`}>
        <Thumb product={p} />
      </button>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex flex-wrap gap-1">
          {p.badges.map((b) => (
            <span key={b} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${b === '산지직송' ? 'bg-green-50 text-cabbage-dark' : 'bg-orange-50 text-tangerine-dark'}`}>
              {b}
            </span>
          ))}
        </div>
        <button onClick={onOpen} className="mt-1.5 text-left text-sm font-semibold leading-snug hover:underline md:text-[15px]">
          {p.name}
        </button>
        <span className="mt-0.5 text-xs text-stone-500">{p.amount}</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-black text-red-500 tabular-nums">{discountRate(p)}%</span>
          <span className="text-lg font-black tabular-nums">{won(p.salePrice)}</span>
        </div>
        <span className="text-xs text-stone-400 line-through tabular-nums">{won(p.price)}</span>
        <div className="mt-auto pt-3">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-dark w-full px-3 py-2.5 text-sm">
              {channel.short}에서 구매 <ExternalLink size={14} />
            </a>
          ) : (
            <button onClick={onOpen} className="btn-dark w-full px-3 py-2.5 text-sm">
              {channel.id === 'app' ? '바로 주문' : `${channel.short}에서 구매`}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductModal({ product: p, channel, onClose, onOrder }: { product: ShopProduct | null; channel: Channel; onClose: () => void; onOrder: (m: string) => void }) {
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  if (!p) return null;
  const total = p.salePrice * qty;
  const shipping = total >= 30000 ? 0 : 3500;

  return (
    <Modal
      open={!!p}
      onClose={() => {
        onClose();
        setQty(1);
        setNotice(null);
      }}
      maxWidth="max-w-3xl"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Thumb product={p} />
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-bold text-stone-400">상대로운 장터 · {p.category}</span>
          <h3 className="mt-1 pr-8 text-xl font-extrabold">{p.name}</h3>
          <p className="text-sm text-stone-500">{p.amount}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">{discountRate(p)}%</span>
            <span className="text-2xl font-black tabular-nums">{won(p.salePrice)}</span>
            <span className="text-sm text-stone-400 line-through">{won(p.price)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{p.desc}</p>
          <dl className="mt-3 space-y-1.5 rounded-2xl bg-stone-50 p-3 text-xs">
            <Row k="제철" v={p.season} />
            <Row k="보관" v={p.storage} />
            <Row k="추천 요리" v={p.recipe} />
            <Row k="배송" v="수확 후 48시간 안에 산지 직송 · 3만 원 이상 무료" />
          </dl>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">수량</span>
            <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-lg bg-white p-1.5 shadow-sm" aria-label="수량 줄이기">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="rounded-lg bg-white p-1.5 shadow-sm" aria-label="수량 늘리기">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between border-t border-stone-200 pt-3">
            <span className="text-xs text-stone-500">배송비 {shipping ? won(shipping) : '무료'}</span>
            <span className="text-xl font-black tabular-nums">{won(total + shipping)}</span>
          </div>

          {/* 판매처별 구매 버튼 */}
          <div className="mt-4 space-y-2">
            {CHANNELS.map((c) => {
              const url = buyUrl(p, c);
              const primary = c.id === channel.id;
              const cls = `${primary ? 'btn-orange' : 'btn-ghost'} w-full py-3 text-sm`;
              if (c.id === 'app')
                return (
                  <button
                    key={c.id}
                    className={cls}
                    onClick={() => {
                      onOrder(`${p.name} ${qty}개 주문이 접수됐어요! 수확 후 48시간 안에 보내드려요 🥬`);
                      onClose();
                      setQty(1);
                    }}
                  >
                    <ShoppingBag size={16} /> 상대로운에서 바로 주문
                  </button>
                );
              return url ? (
                <a key={c.id} href={url} target="_blank" rel="noopener noreferrer" className={cls}>
                  <Store size={16} /> {c.name}에서 구매 <ExternalLink size={14} />
                </a>
              ) : (
                <button key={c.id} className={cls} onClick={() => setNotice(c.name)}>
                  <Store size={16} /> {c.name}에서 구매
                </button>
              );
            })}
          </div>
          {notice && (
            <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
              {notice} 주소가 아직 연결되지 않았어요. 스토어를 열면 주소만 넣어 바로 이 버튼에서 구매 페이지로 이동하게 할 수 있어요.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-14 shrink-0 font-bold text-stone-500">{k}</dt>
      <dd className="min-w-0 text-stone-700">{v}</dd>
    </div>
  );
}
