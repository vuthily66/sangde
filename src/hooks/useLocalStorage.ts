import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? ({ ...initial, ...JSON.parse(raw) } as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 저장 불가 환경(시크릿 모드 등)에서도 동작 유지 */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
