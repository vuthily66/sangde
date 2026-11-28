export const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const daysSince = (iso: string) => Math.max(1, Math.ceil((Date.now() - new Date(iso).getTime()) / 86400000));

/** 사진을 480px JPEG로 줄여 localStorage에 담을 수 있게 */
export async function shrinkPhoto(file: File, max = 480): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}

