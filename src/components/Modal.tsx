import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, children, maxWidth = 'max-w-md' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-basalt/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={`relative max-h-[92vh] w-full ${maxWidth} animate-pop overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-stone-400 hover:bg-stone-100" aria-label="닫기">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
