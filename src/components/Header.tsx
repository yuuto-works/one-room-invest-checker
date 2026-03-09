export default function Header() {
  return (
    <header className="rounded-[24px] border border-line bg-white/95 p-5 shadow-panel sm:p-6 lg:p-8">
      <div className="inline-flex rounded-full bg-softblue px-3 py-2 text-xs font-semibold text-navy sm:px-4 sm:text-sm">
        営業トークではなく、データで判断する
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.95fr)] lg:items-end lg:gap-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[2.8rem] lg:leading-tight">
            ワンルーム投資危険度チェッカー
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:text-lg">
            利回り、相場比較、ランニングコスト、長期収支までを1つの画面で確認できます。
            まず入口の条件を冷静に見て、そのあと出口まで数字で考えるためのMVPです。
          </p>
        </div>
        <div className="grid gap-3 rounded-2xl border border-line bg-mist p-4 text-sm text-slate-700 sm:p-5">
          <div>
            <div className="font-semibold text-ink">このアプリで見たいこと</div>
            <div className="mt-1 leading-6">① 入口の危険度 ② 長期の手残り ③ 前提を変えたときの着地</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white p-3">
              <div className="text-base font-bold text-navy sm:text-lg">相場比</div>
              <div className="mt-1 text-[11px] text-slate-500 sm:text-xs">割高か</div>
            </div>
            <div className="rounded-xl bg-white p-3">
              <div className="text-base font-bold text-navy sm:text-lg">利回り</div>
              <div className="mt-1 text-[11px] text-slate-500 sm:text-xs">入口CF</div>
            </div>
            <div className="rounded-xl bg-white p-3">
              <div className="text-base font-bold text-navy sm:text-lg">出口</div>
              <div className="mt-1 text-[11px] text-slate-500 sm:text-xs">売却時損益</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
