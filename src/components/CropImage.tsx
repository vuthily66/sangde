import cabbageImg from '../assets/cabbage.webp';
import tangerineImg from '../assets/tangerine.webp';
import type { CropType } from '../types';

export const CROP_IMAGES: Record<CropType, string> = {
  tangerine: tangerineImg,
  cabbage: cabbageImg,
};

const ALT: Record<CropType, string> = {
  tangerine: '상대리 감귤',
  cabbage: '상대리 양배추',
};

interface Props {
  crop: CropType;
  size?: number | string;
  className?: string;
}

/** 감귤·양배추 렌더링 이미지 */
export default function CropImage({ crop, size = 48, className = '' }: Props) {
  return (
    <img
      src={CROP_IMAGES[crop]}
      alt={ALT[crop]}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      style={typeof size === 'string' ? { width: size, height: size } : undefined}
      className={`inline-block shrink-0 select-none object-contain ${className}`}
      draggable={false}
    />
  );
}
