import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4">
      <div key={message} className="flex animate-pop items-center gap-2 rounded-2xl bg-basalt px-4 py-3 text-sm font-medium text-white shadow-xl">
        <CheckCircle2 size={18} className="shrink-0 text-green-400" />
        {message}
      </div>
    </div>
  );
}
