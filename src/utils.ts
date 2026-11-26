export const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const daysSince = (iso: string) => Math.max(1, Math.ceil((Date.now() - new Date(iso).getTime()) / 86400000));
