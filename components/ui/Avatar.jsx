import { initials } from '@/lib/format';

const tones = ['bg-brand-100 text-brand-700', 'bg-sun-100 text-sun-600', 'bg-rose-50 text-rose-600', 'bg-ink-100 text-ink-700', 'bg-[#E3ECF8] text-[#3E6FB0]'];

export default function Avatar({ name, size = 36 }) {
  const tone = tones[(name?.charCodeAt(0) || 0) % tones.length];
  return (
    <span className={`grid shrink-0 place-items-center rounded-full text-xs font-semibold ${tone}`} style={{ width: size, height: size }} aria-hidden>
      {initials(name)}
    </span>
  );
}
