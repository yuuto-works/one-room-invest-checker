type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'positive' | 'caution' | 'danger';
};

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-mist border-line text-ink',
  positive: 'bg-positive border-emerald-200 text-emerald-900',
  caution: 'bg-caution border-amber-200 text-amber-900',
  danger: 'bg-danger border-red-200 text-red-900',
};

export default function MetricCard({ label, value, hint, tone = 'default' }: Props) {
  const toneClass = toneMap[tone];
  const mutedClass =
    tone === 'default'
      ? 'text-slate-500'
      : tone === 'danger'
        ? 'text-red-700'
        : tone === 'positive'
          ? 'text-emerald-700'
          : 'text-amber-700';

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${toneClass}`}>
      <div className={`text-sm font-medium ${mutedClass}`}>{label}</div>
      <div className="mt-2 text-[1.7rem] font-bold tracking-tight leading-tight sm:text-[1.9rem]">{value}</div>
      {hint ? <div className={`mt-2 text-xs leading-5 ${mutedClass}`}>{hint}</div> : null}
    </div>
  );
}
