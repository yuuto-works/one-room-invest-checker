import { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}>;

export default function Panel({ title, subtitle, actions, children }: Props) {
  return (
    <section className="rounded-[22px] border border-line bg-white p-4 shadow-panel sm:p-5 lg:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h2 className="text-lg font-bold text-ink sm:text-xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="w-full md:w-auto md:flex-shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
