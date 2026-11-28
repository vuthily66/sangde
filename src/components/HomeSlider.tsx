import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import basketMain from '../assets/photos/basket-main.webp';
import fieldMain from '../assets/photos/field-main.webp';
import orchardBush from '../assets/photos/orchard-bush.webp';
import tangerineClose from '../assets/photos/tangerine-close.webp';
import Wordmark from './Wordmark';

interface Slide {
  id: string;
  photo: string;
  position?: string; // object-position (세로 사진을 가로 화면에 맞출 때 보여줄 부분)
  caption?: string;
  intro?: boolean;
}

// 상대리 현장 사진. 사진을 바꾸거나 더하려면 이 목록만 고치면 돼요.
const SLIDES: Slide[] = [
  { id: 'intro', photo: fieldMain, position: '50% 55%', intro: true },
  { id: 'tangerine', photo: tangerineClose, position: '50% 50%', caption: '햇살 아래 노랗게 익은 상대리 감귤' },
  { id: 'orchard', photo: orchardBush, position: '50% 55%', caption: '땅과 함께 살아온 상대리 사람들이 키웁니다' },
  { id: 'basket', photo: basketMain, position: '50% 50%', caption: '한 철의 정성을 바구니에 담아 당신의 식탁까지' },
];

/** 홈 전체 화면 슬라이드 */
export default function HomeSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), 2000);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#1b211d] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="상대로운 소개"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[700ms] ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.photo}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[2600ms] ease-out ${i === index ? 'scale-105' : 'scale-100'}`}
            style={{ objectPosition: s.position ?? 'center', filter: 'saturate(0.85)' }}
          />
        </div>
      ))}

      {/* 영화 같은 어두운 톤 + 필름 그레인 */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13] mix-blend-overlay" aria-hidden="true">
        <filter id="hs-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hs-grain)" />
      </svg>

      {/* 오른쪽 위 로고 */}
      <Wordmark className="absolute right-10 top-10 hidden drop-shadow-lg md:block" />

      {/* 슬라이드 글 */}
      {SLIDES.map((s, i) =>
        s.intro ? (
          <Intro key={s.id} visible={i === index} />
        ) : (
          <p
            key={s.id}
            aria-hidden={i !== index}
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-2xl font-medium tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-all duration-1000 md:pl-60 md:text-3xl ${
              i === index ? 'opacity-100 delay-200' : 'translate-y-2 opacity-0'
            }`}
            style={{ textWrap: 'balance' }}
          >
            {s.caption}
          </p>
        ),
      )}

      {/* 하단 컨트롤 */}
      <a href="#products" className="absolute bottom-24 left-6 flex flex-col items-center gap-1 text-sm font-semibold text-white/85 hover:text-white md:bottom-10 md:left-1/2 md:ml-[7.5rem] md:-translate-x-1/2">
        내 농장 분양받기
        <ArrowDown size={18} className="animate-bob" />
      </a>
      <div className="absolute right-4 top-20 flex items-center gap-3 md:bottom-10 md:right-10 md:top-auto">
        <span className="font-mono text-xs tabular-nums text-white/80">
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
        <div className="hidden gap-1.5 sm:flex">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} aria-label={`${i + 1}번째 장면`} className={`h-1 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-4 bg-white/40'}`} />
          ))}
        </div>
        <button onClick={() => go(-1)} aria-label="이전 장면" className="grid h-9 w-9 place-items-center rounded-full border border-white/40 hover:bg-white/15">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => go(1)} aria-label="다음 장면" className="grid h-9 w-9 place-items-center rounded-full border border-white/40 hover:bg-white/15">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Intro({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-0 overflow-y-auto px-6 pb-40 pt-24 transition-opacity duration-1000 md:pl-[19rem] md:pr-12 md:pt-14 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="flex max-w-xl flex-col gap-5">
        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight drop-shadow-lg md:text-6xl">
          한림으로부터
          <br />
          식탁까지
        </h1>
        <div className="max-w-lg space-y-3 text-[15px] leading-relaxed text-white/90 drop-shadow">
          <p>먹거리는 땅에서 시작해 식탁에서 완성됩니다.</p>
          <p className="hidden sm:block">
            상대로운은 제주 한림읍 상대리 농부들이 정성껏 키운 감귤 나무와 양배추 밭을 분양하고, 수확한 작물을 꾸러미와 밀키트로 집까지 보내드리는 마을 농장입니다.
          </p>
          <p>내가 이름 붙인 나무가 자라는 모습을 지켜보고, 수확철에는 직접 와서 따 가세요.</p>
        </div>
      </div>
      <JejuOutline className="mx-auto mt-8 w-full max-w-md md:absolute md:bottom-28 md:right-12 md:mt-0 md:w-[40%] md:max-w-lg" />
    </div>
  );
}

/** 제주도 윤곽 + 상대리 위치 (대략적인 모양) */
function JejuOutline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 130" className={className} role="img" aria-label="제주도 지도 위 상대리 위치">
      <filter id="jo-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="4" />
      </filter>
      <g filter="url(#jo-rough)" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M14 74 C12 60 24 50 42 44 C60 36 80 30 104 26 C130 20 158 18 184 20 C210 22 236 26 258 32 C272 36 282 44 280 56 C278 68 266 76 248 84 C226 94 200 104 170 110 C140 114 110 114 84 110 C60 106 36 98 22 90 C16 86 14 80 14 74Z" />
        <circle cx="292" cy="40" r="5" />
      </g>
      <path d="M140 70 L148 60 L156 70" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
      <text x="148" y="80" textAnchor="middle" fontSize="7" fill="#fff" fillOpacity="0.6">한라산</text>
      <g transform="translate(54 60)">
        <circle r="10" fill="#F97316" opacity="0.3">
          <animate attributeName="r" values="5;12;5" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <path d="M0 4 C-5 -2 -6 -5 -6 -7 A6 6 0 0 1 6 -7 C6 -5 5 -2 0 4Z" fill="#fff" />
        <circle cy="-7" r="2.2" fill="#1b211d" />
        <text x="8" y="-12" fontSize="9" fontWeight="700" fill="#fff">상대리</text>
      </g>
    </svg>
  );
}
