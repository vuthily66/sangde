import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="fixed bottom-20 right-3 z-50 flex items-center gap-2 md:bottom-4 md:right-4">
      {confirming && (
        <div className="flex animate-pop items-center gap-1 rounded-xl bg-white p-1 text-xs shadow-lg ring-1 ring-stone-200">
          <span className="px-2 font-medium text-stone-600">모든 데이터를 초기화할까요?</span>
          <button
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
            className="rounded-lg bg-red-500 px-2.5 py-1.5 font-bold text-white hover:bg-red-600"
          >
            초기화
          </button>
          <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1.5 font-semibold text-stone-500 hover:bg-stone-100">
            취소
          </button>
        </div>
      )}
      <button
        onClick={() => setConfirming((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-basalt/80 px-3 py-2 text-[11px] font-semibold text-white/90 shadow-lg backdrop-blur transition hover:bg-basalt"
        title="시연용 데이터 초기화"
      >
        <RotateCcw size={13} />
        Reset Demo
      </button>
    </div>
  );
}
