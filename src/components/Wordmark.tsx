/** 붓글씨 로고 + 영문 */
export default function Wordmark({ className = '', size = 'lg' }: { className?: string; size?: 'sm' | 'lg' }) {
  const big = size === 'lg';
  return (
    <div className={`select-none text-center leading-none ${className}`}>
      <div className={`font-brush ${big ? 'text-6xl md:text-7xl' : 'text-4xl'}`}>상대로운</div>
      <div className={`mt-1 font-bold uppercase ${big ? 'text-sm tracking-[0.45em]' : 'text-[9px] tracking-[0.35em]'}`}>Sangdae Farm</div>
      {big && <div className="mt-1 text-xs tracking-wide opacity-85">from hallim to your table</div>}
    </div>
  );
}
