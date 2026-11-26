import { Copy } from 'lucide-react';
import { useState } from 'react';
import { getProduct } from '../data/farmProducts';
import type { MyFarm } from '../types';
import { formatDate } from '../utils';
import Durung from './Durung';
import Modal from './Modal';
import CropImage from './CropImage';

interface Props {
  open: boolean;
  onClose: () => void;
  farms: MyFarm[];
  issuedAt: string | null;
}

export default function CertificateModal({ open, onClose, farms, issuedAt }: Props) {
  const [copied, setCopied] = useState(false);
  const date = issuedAt ?? new Date().toISOString();
  const certNo = `SDR-${date.slice(0, 10).replace(/-/g, '')}-${String(new Date(date).getTime()).slice(-4)}`;
  const owner = farms.length ? farms.map((f) => `${getProduct(f.cropType).emoji} ${f.nickname}`).join(' · ') : '상대리 방문객';

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border-4 border-double border-tangerine bg-gradient-to-b from-orange-50 via-white to-green-50 p-6 text-center">
        <CropImage crop="tangerine" size={110} className="absolute -left-8 -top-8 opacity-15" />
        <CropImage crop="cabbage" size={120} className="absolute -bottom-8 -right-8 opacity-15" />
        <div className="text-[11px] font-bold tracking-[0.3em] text-cabbage">CERTIFICATE OF DIGITAL FARMER</div>
        <h3 className="mt-2 text-2xl font-black">디지털 농부 인증서</h3>
        <Durung size={84} mood="excited" className="mx-auto mt-3" />
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          위 사람은 제주시 한림읍 상대리 마을에서
          <br />
          <b className="text-basalt">양배추 밭 포토존 · 감귤 창고 카페 · 돌담길 산책</b>
          <br />
          스탬프 미션을 모두 완수하였기에
          <br />
          <b className="text-tangerine">상대리 명예 디지털 농부</b>로 인증합니다.
        </p>
        <div className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-sm ring-1 ring-stone-200">
          <div className="text-[11px] font-semibold text-stone-400">함께 키운 작물</div>
          <div className="font-bold">{owner}</div>
        </div>
        <div className="mt-4 flex items-end justify-between text-left text-[11px] text-stone-500">
          <div>
            <div>발급일 {formatDate(date)}</div>
            <div>No. {certNo}</div>
          </div>
          <div className="grid h-16 w-16 -rotate-12 place-items-center rounded-full border-2 border-red-500 text-center text-[10px] font-black leading-tight text-red-500">
            상대리
            <br />
            마을회
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          navigator.clipboard
            ?.writeText(`상대리 디지털 농부 인증서 No. ${certNo} (${formatDate(date)})`)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
        }}
        className="btn-dark mt-4 w-full"
      >
        <Copy size={18} /> {copied ? '인증 번호를 복사했어요' : '인증 번호 복사하기'}
      </button>
    </Modal>
  );
}
