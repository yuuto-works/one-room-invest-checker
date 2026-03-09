import MetricCard from '../../components/MetricCard';
import Panel from '../../components/Panel';
import { SimulationResult as SimulationResultType, SimulationYearRow } from '../../types';
import { formatManYen, formatPercent, formatSignedManYen, formatYen } from '../../utils/format';
import SimulationCharts from './SimulationCharts';

type Props = {
  result: SimulationResultType;
};

function toneByValue(value: number): 'positive' | 'caution' | 'danger' {
  if (value > 0) return 'positive';
  if (value > -2000000) return 'caution';
  return 'danger';
}

function signedTextClass(value: number): string {
  if (value > 0) return 'text-emerald-700';
  if (value < 0) return 'text-red-700';
  return 'text-slate-700';
}

function IrrBadge({ irr }: { irr: number | null }) {
  if (irr === null) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-slate-400">算出不可</div>
        <div className="text-xs text-slate-400">キャッシュフロー構造上、IRRを計算できません</div>
      </div>
    );
  }

  const irrPercent = irr * 100;
  const valueText = formatPercent(irrPercent);
  const { colorClass, label } =
    irrPercent >= 5
      ? { colorClass: 'text-emerald-700', label: '投資効率は良好な水準です' }
      : irrPercent >= 2
        ? { colorClass: 'text-amber-700', label: '投資効率は標準的な水準です' }
        : { colorClass: 'text-red-700', label: '投資効率はやや低い水準です' };

  return (
    <div className="flex items-baseline gap-3">
      <div className={`text-2xl font-bold ${colorClass}`}>{valueText}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function YearRowCard({ row }: { row: SimulationYearRow }) {
  return (
    <div className="rounded-2xl border border-line bg-mist p-4 md:hidden">
      <div className="flex items-center justify-between border-b border-white/80 pb-3">
        <div className="text-sm font-semibold text-slate-500">{row.year}年目</div>
        <div className={`text-sm font-bold ${signedTextClass(row.totalProfitIfSold)}`}>{formatSignedManYen(row.totalProfitIfSold / 10000)}</div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">年間CF</dt>
          <dd className={`mt-1 font-semibold ${signedTextClass(row.annualCashFlow)}`}>{formatSignedManYen(row.annualCashFlow / 10000)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">累計CF</dt>
          <dd className={`mt-1 font-semibold ${signedTextClass(row.cumulativeCashFlow)}`}>{formatSignedManYen(row.cumulativeCashFlow / 10000)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">資産価値</dt>
          <dd className="mt-1 font-semibold text-ink">{formatManYen(row.assetValue / 10000)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">残債</dt>
          <dd className="mt-1 font-semibold text-ink">{formatManYen(row.remainingLoan / 10000)}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function SimulationResult({ result }: Props) {
  const { summary, rows } = result;
  const tone = toneByValue(summary.totalProfitAtExit);

  return (
    <div className="grid gap-5 lg:gap-6">
      <Panel title="出口の結論" subtitle="今の前提で保有年数まで持った場合のざっくりした着地です。">
        <div className="rounded-[22px] border border-line bg-mist p-5 sm:p-6 lg:p-7">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <div className="text-sm font-semibold text-slate-500">保有年数時点の最終損益</div>
              <div className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${signedTextClass(summary.totalProfitAtExit)}`}>
                {formatSignedManYen(summary.totalProfitAtExit / 10000)}
              </div>
              <div
                className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  tone === 'positive'
                    ? 'bg-positive text-emerald-900'
                    : tone === 'caution'
                      ? 'bg-caution text-amber-900'
                      : 'bg-danger text-red-900'
                }`}
              >
                {summary.totalProfitAtExit > 0
                  ? '黒字想定'
                  : summary.totalProfitAtExit > -2000000
                    ? '小幅赤字想定'
                    : '赤字想定'}
              </div>
            </div>
            <div className="text-sm leading-7 text-slate-600">
              売却時の手残りと、それまでの累計キャッシュフローを合わせた簡易モデルです。
              最適売却年も下に出しているので、出口タイミングの目安にも使えます。
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-line bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="text-sm font-semibold text-slate-500">IRR（内部収益率）</div>
            <IrrBadge irr={summary.irr} />
          </div>
          <div className="mt-1 text-xs text-slate-400">
            頭金を初期投資とし、毎年のCFと売却時手残りを含めた割引率。年利換算で投資効率を示します。
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-5">
        <MetricCard label="毎月返済額" value={formatYen(summary.monthlyLoanPayment)} hint="元利均等の簡易計算" />
        <MetricCard label="想定売却価格" value={formatManYen(summary.salePriceAtExit / 10000)} />
        <MetricCard
          label="売却時残債"
          value={formatManYen(summary.remainingLoanAtExit / 10000)}
          tone={summary.remainingLoanAtExit > summary.salePriceAtExit ? 'danger' : 'default'}
        />
        <MetricCard
          label="売却後の手残り"
          value={formatSignedManYen(summary.saleNetAtExit / 10000)}
          tone={summary.saleNetAtExit > 0 ? 'positive' : summary.saleNetAtExit < 0 ? 'danger' : 'default'}
        />
        <MetricCard
          label="最適売却年"
          value={`${summary.bestSellYear}年目`}
          hint={`その時の損益 ${formatSignedManYen(summary.bestSellProfit / 10000)}`}
          tone={summary.bestSellProfit > 0 ? 'positive' : summary.bestSellProfit < 0 ? 'danger' : 'caution'}
        />
      </div>

      <SimulationCharts rows={rows} />

      <Panel title="年ごとの推移" subtitle="下に行くほど後年です。長めに見たときの出口の差を確認できます。">
        <div className="grid gap-3 md:hidden">
          {rows.map((row) => (
            <YearRowCard key={row.year} row={row} />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2">年</th>
                <th className="px-3 py-2">年間CF</th>
                <th className="px-3 py-2">累計CF</th>
                <th className="px-3 py-2">資産価値</th>
                <th className="px-3 py-2">残債</th>
                <th className="px-3 py-2">売却時損益</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className="rounded-2xl bg-mist text-slate-700">
                  <td className="rounded-l-2xl px-3 py-3 font-semibold text-ink">{row.year}</td>
                  <td className={`px-3 py-3 font-medium ${signedTextClass(row.annualCashFlow)}`}>{formatSignedManYen(row.annualCashFlow / 10000)}</td>
                  <td className={`px-3 py-3 font-medium ${signedTextClass(row.cumulativeCashFlow)}`}>{formatSignedManYen(row.cumulativeCashFlow / 10000)}</td>
                  <td className="px-3 py-3 font-medium text-ink">{formatManYen(row.assetValue / 10000)}</td>
                  <td className="px-3 py-3 font-medium text-ink">{formatManYen(row.remainingLoan / 10000)}</td>
                  <td className={`rounded-r-2xl px-3 py-3 font-semibold ${signedTextClass(row.totalProfitIfSold)}`}>{formatSignedManYen(row.totalProfitIfSold / 10000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
