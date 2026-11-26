import Durung from './Durung';

interface Props {
  message: string;
  mood?: 'happy' | 'excited' | 'wink';
  size?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

/** 두룽 + 말풍선 가이드 카드. message가 바뀔 때마다 pop 애니메이션 */
export default function DurungBubble({ message, mood = 'happy', size = 76, tone = 'light', className = '' }: Props) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Durung size={size} mood={mood} className="shrink-0 animate-bob" />
      <div
        key={message}
        className={`relative mb-3 animate-pop rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed shadow-sm ${
          tone === 'dark' ? 'bg-white/10 text-white backdrop-blur' : 'bg-white text-basalt border border-orange-100'
        }`}
      >
        <span className={`mb-0.5 block text-[11px] font-bold ${tone === 'dark' ? 'text-orange-300' : 'text-tangerine'}`}>
          가이드 두룽
        </span>
        {message}
      </div>
    </div>
  );
}
