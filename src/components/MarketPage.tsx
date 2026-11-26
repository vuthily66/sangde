import { Clock, Minus, Plus, Receipt, ShoppingCart, Tag, Truck, Users } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { MEAL_KITS, PACKAGE_OPTIONS, PRICING_RULES } from '../data/market';
import type { Cart, MyFarm, PackageId } from '../types';
import { won } from '../utils';
import Durung from './Durung';
import DurungBubble from './DurungBubble';
import Modal from './Modal';
import { farmSchedule, md, ymd } from '../season';
import CropImage from './CropImage';

interface Props {
  farms: MyFarm[];
  cart: Cart;
  packageId: PackageId | null;
  onChangeQty: (kitId: string, delta: number) => void;
  onSelectPackage: (id: PackageId | null) => void;
  onOrder: () => void;
  onGoTravel: () => void;
}

export default function MarketPage({ farms, cart, packageId, onChangeQty, onOrder, onGoTravel }: Props) {
  const [orderDone, setOrderDone] = useState<null | { total: number; no: string; kits: boolean; pkg: boolean }>(null);
  const isMember = farms.length > 0;
  const harvested = farms.filter((f) => f.harvested);

  const calc = useMemo(() => {
    const kitCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const kitSubtotal = MEAL_KITS.reduce((sum, k) => sum + k.price * (cart[k.id] ?? 0), 0);
    const pkg = PACKAGE_OPTIONS.find((p) => p.id === packageId);
    const pkgPrice = pkg?.price ?? 0;
    const subtotal = kitSubtotal + pkgPrice;
    const memberDiscount = isMember ? subtotal * PRICING_RULES.memberDiscountRate : 0;
    const bundleDiscount = kitCount >= PRICING_RULES.bundleThreshold ? kitSubtotal * PRICING_RULES.bundleDiscountRate : 0;
    const harvestCredit = pkg && harvested.length > 0 ? PRICING_RULES.harvestCredit * harvested.length : 0;
    const afterDiscount = Math.max(0, subtotal - memberDiscount - bundleDiscount - harvestCredit);
    const shipping = subtotal === 0 || afterDiscount >= PRICING_RULES.freeShippingOver ? 0 : PRICING_RULES.shippingFee;
    const total = Math.round(afterDiscount + shipping);
    const saved = Math.round(memberDiscount + bundleDiscount + harvestCredit + (subtotal > 0 && shipping === 0 ? PRICING_RULES.shippingFee : 0));
    return { kitCount, kitSubtotal, pkg, pkgPrice, subtotal, memberDiscount, bundleDiscount, harvestCredit, shipping, total, saved };
  }, [cart, packageId, isMember, harvested.length]);

  // 꾸러미는 내 작물의 실제 수확 기간에, 밀키트는 바로 출고
  const shipLines = farms.map((f) => {
    const sc = farmSchedule(f);
    return { label: `${f.nickname} 꾸러미`, value: `${ymd(sc.harvestStart)} ~ ${md(sc.harvestEnd)} 산지 직송` };
  });

  const durungMsg = harvested.length
    ? `수확한 ${harvested.map((f) => f.nickname).join(', ')}으로 만든 밀키트를 맛봐! 분양 고객은 10% 할인이야 😋`
    : isMember
      ? '분양 고객은 전 상품 10% 할인! 밀키트 3개 이상 담으면 5% 추가 할인이야 🎁'
      : '농장을 분양받으면 10% 회원 할인이 적용돼! 먼저 둘러보고 담아봐~';

  const freeShipLeft = PRICING_RULES.freeShippingOver - (calc.subtotal - calc.memberDiscount - calc.bundleDiscount - calc.harvestCredit);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-sm font-bold text-cabbage">PACKAGE & MEAL KIT</span>
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">상대리 로컬 밀키트 & 꾸러미</h2>
        <p className="mt-1 text-stone-500">내 농장에서 수확한 감귤과 양배추로 만든 상대리 특화 레시피</p>
      </div>

      <DurungBubble message={durungMsg} mood={harvested.length ? 'excited' : 'happy'} size={64} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          {/* 밀키트 */}
          <section>
            <h3 className="mb-3 text-lg font-extrabold">🍳 로컬 밀키트 3종</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {MEAL_KITS.map((k) => {
                const qty = cart[k.id] ?? 0;
                const isOrange = k.localCrop === 'tangerine';
                return (
                  <article key={k.id} className={`card flex flex-col overflow-hidden transition ${qty ? 'ring-2 ring-tangerine' : ''}`}>
                    <div className={`relative grid h-32 place-items-center text-6xl ${isOrange ? 'bg-orange-50' : 'bg-green-50'}`}>
                      {k.emoji}
                      <CropImage crop={k.localCrop} size={52} className="absolute bottom-2 right-3 drop-shadow-md" />
                      <span className={`chip absolute left-3 top-3 ${isOrange ? 'bg-tangerine text-white' : 'bg-cabbage text-white'}`}>
                        <CropImage crop={k.localCrop} size={16} />{isOrange ? '상대리 감귤' : '상대리 양배추'}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="text-[11px] font-bold text-stone-400">{k.tag}</span>
                      <h4 className="font-extrabold leading-snug">{k.name}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-stone-500">{k.ingredients.join(' + ')}</p>
                      <div className="mt-2 flex gap-3 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1"><Users size={12} />{k.servings}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{k.cookTime}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-extrabold">{won(k.price)}</span>
                        {qty === 0 ? (
                          <button onClick={() => onChangeQty(k.id, 1)} className="btn-dark px-3 py-2 text-sm">
                            <ShoppingCart size={15} /> 담기
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
                            <button onClick={() => onChangeQty(k.id, -1)} className="rounded-lg bg-white p-1.5 shadow-sm" aria-label="수량 감소"><Minus size={14} /></button>
                            <span className="w-7 text-center font-bold">{qty}</span>
                            <button onClick={() => onChangeQty(k.id, 1)} className="rounded-lg bg-white p-1.5 shadow-sm" aria-label="수량 증가"><Plus size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {/* 결제 계산기 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="basalt-wall flex items-center gap-2 px-5 py-4 text-white">
              <Receipt size={18} />
              <h3 className="font-bold">실시간 예상 결제 금액</h3>
            </div>
            <div className="space-y-2.5 p-5 text-sm">
              {calc.subtotal === 0 ? (
                <p className="py-6 text-center text-stone-400">밀키트를 담거나 꾸러미를 선택해 주세요</p>
              ) : (
                <>
                  {MEAL_KITS.filter((k) => cart[k.id]).map((k) => (
                    <Row key={k.id} label={`${k.emoji} ${k.name} × ${cart[k.id]}`} value={won(k.price * cart[k.id])} />
                  ))}
                  {calc.pkg && <Row label={`${calc.pkg.id === 'basic' ? '🧺' : '📦'} ${calc.pkg.name}`} value={won(calc.pkgPrice)} />}
                  <div className="border-t border-dashed border-stone-200 pt-2.5" />
                  <Row label="상품 합계" value={won(calc.subtotal)} bold />
                  <Discount label="분양 고객 10% 할인" value={calc.memberDiscount} hint={!isMember ? '농장 분양 시 적용' : undefined} />
                  <Discount label="밀키트 3개+ 번들 5%" value={calc.bundleDiscount} hint={calc.kitCount < 3 ? `${3 - calc.kitCount}개 더 담으면 적용` : undefined} />
                  <Row
                    label={<span className="flex items-center gap-1"><Truck size={14} /> 배송비</span>}
                    value={calc.shipping ? won(calc.shipping) : '무료'}
                  />
                  {calc.shipping > 0 && freeShipLeft > 0 && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">{won(freeShipLeft)} 더 담으면 무료배송!</p>
                  )}
                </>
              )}
              <div className="mt-2 rounded-2xl bg-stone-50 p-4">
                <div className="flex items-end justify-between">
                  <span className="font-bold">최종 결제 금액</span>
                  <span className="text-2xl font-extrabold text-tangerine">{won(calc.total)}</span>
                </div>
                {calc.saved > 0 && (
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-cabbage">
                    <Tag size={12} /> 총 {won(calc.saved)} 절약했어요
                  </p>
                )}
              </div>
              <button
                disabled={calc.subtotal === 0}
                onClick={() => {
                  setOrderDone({ total: calc.total, no: `SD-${Date.now().toString().slice(-8)}`, kits: calc.kitCount > 0, pkg: !!calc.pkg });
                  onOrder();
                }}
                className="btn-orange w-full py-4 text-base"
              >
                주문하기 (모의 결제)
              </button>
              <p className="text-center text-[11px] text-stone-400">시연용 프로토타입으로 실제 결제는 이루어지지 않아요</p>
            </div>
          </div>
        </aside>
      </div>

      <Modal open={!!orderDone} onClose={() => setOrderDone(null)}>
        <div className="flex flex-col items-center text-center">
          <Durung size={96} mood="excited" className="animate-bob" />
          <h3 className="mt-3 text-xl font-extrabold">주문이 완료됐어요! 🎉</h3>
          <p className="mt-1 text-sm text-stone-500">주문번호 {orderDone?.no}</p>
          <div className="mt-4 w-full rounded-2xl bg-stone-50 p-4 text-sm">
            <Row label="결제 금액" value={won(orderDone?.total ?? 0)} bold />
            {orderDone?.kits && <Row label="밀키트 출고" value="주문 후 3일 이내 냉장 배송" />}
            {orderDone?.pkg &&
              (shipLines.length ? (
                shipLines.map((l) => <Row key={l.label} label={l.label} value={l.value} />)
              ) : (
                <Row label="꾸러미 출고" value="상대리 제철 수확 기간 중 순차 배송" />
              ))}
          </div>
          <p className="mt-4 text-sm text-stone-600">상대리에 직접 놀러 오면 스탬프 투어와 수확 체험도 할 수 있어!</p>
          <button
            onClick={() => {
              setOrderDone(null);
              onGoTravel();
            }}
            className="btn-green mt-5 w-full"
          >
            마을 여행 혜택 보러 가기
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, bold }: { label: ReactNode; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${bold ? 'font-bold' : 'text-stone-600'}`}>
      <span>{label}</span>
      <span className="shrink-0">{value}</span>
    </div>
  );
}

function Discount({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className={value ? 'text-cabbage' : 'text-stone-400'}>
        {label}
        {hint && !value && <span className="block text-[11px]">{hint}</span>}
      </span>
      <span className={`shrink-0 font-semibold ${value ? 'text-cabbage' : 'text-stone-300'}`}>{value ? `-${won(value)}` : '-'}</span>
    </div>
  );
}
