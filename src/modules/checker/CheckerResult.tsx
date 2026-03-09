import MetricCard from '../../components/MetricCard';
import Panel from '../../components/Panel';
import { AREA_BENCHMARKS } from '../../constants/areas';
import { PropertyInput, ScoreResult } from '../../types';
import { formatPercent } from '../../utils/format';

function scoreTone(score: number): 'positive' | 'caution' | 'danger' {
  if (score >= 80) return 'positive';
  if (score >= 60) return 'caution';
  return 'danger';
}

type Props = {
  input: PropertyInput;
  result: ScoreResult;
  onGoSimulation: () => void;
};

export default function CheckerResult({ input, result, onGoSimulation }: Props) {
  const benchmark = AREA_BENCHMARKS[input.area];
  const gapTone = result.priceGapPercent > 15 ? 'danger' : result.priceGapPercent > 5 ? 'caution' : 'positive';
  const tone = scoreTone(result.score);

  return (
    <div className="grid gap-5 lg:gap-6">
      <Panel
        title="総合評価"
        subtitle="入口の条件をざっくりふるいにかけるための目安です。"
        actions={
          <button
            type="button"
            onClick={onGoSimulation}
            className="w-full rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 md:w-auto"
          >
            この条件で長期収支をシミュレーションする
          </button>
        }
      >
        <div className="rounded-[22px] border border-line bg-mist p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-500">危険度スコア</div>
              <div className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">{result.score}</div>
              <div
                className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  tone === 'positive'
                    ? 'bg-positive text-emerald-900'
                    : tone === 'caution'
                      ? 'bg-caution text-amber-900'
                      : 'bg-danger text-red-900'
                }`}
              >
                {result.label}
              </div>
            </div>
            <div className="max-w-xl text-sm leading-7 text-slate-600">{result.summary}</div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="表面利回り" value={formatPercent(result.grossYield)} hint="家賃 ÷ 価格のシンプルな入口指標" />
        <MetricCard label="簡易利回り" value={formatPercent(result.netYield)} hint="管理費と修繕積立金を差し引いた目安" />
        <MetricCard
          label="平米単価"
          value={`${result.pricePerSqm.toFixed(1)}万円/㎡`}
          hint={`エリア平均 ${result.areaAveragePricePerSqm.toFixed(1)}万円/㎡`}
        />
        <MetricCard
          label="相場比"
          value={`${result.priceGapPercent >= 0 ? '+' : ''}${result.priceGapPercent.toFixed(1)}%`}
          hint="プラスなら平均より高め"
          tone={gapTone}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:gap-6">
        <Panel title="チェックしたいポイント" subtitle="減点がなければ、入口条件は比較的素直です。">
          {result.reasons.length === 0 ? (
            <div className="rounded-2xl bg-positive p-4 text-sm leading-6 text-emerald-900">
              大きな減点理由はありません。家賃の持続性や出口価格の前提を確認しながら検討できます。
            </div>
          ) : (
            <ul className="grid gap-3">
              {result.reasons.map((reason) => (
                <li key={reason} className="rounded-2xl border border-line bg-mist px-4 py-3 text-sm leading-6 text-slate-700">
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="相場データの前提" subtitle="今はMVP用のサンプル値。将来はAPI連携で差し替えやすい構成です。">
          <dl className="grid gap-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-line bg-mist p-4">
              <dt className="font-semibold text-ink">出典</dt>
              <dd className="mt-1 leading-6">{benchmark.source}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-mist p-4">
              <dt className="font-semibold text-ink">集計時期</dt>
              <dd className="mt-1">{benchmark.period}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-mist p-4">
              <dt className="font-semibold text-ink">更新日</dt>
              <dd className="mt-1">{benchmark.updatedAt}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-mist p-4">
              <dt className="font-semibold text-ink">注意書き</dt>
              <dd className="mt-1 leading-6">個別物件の価値を断定するものではなく、検討を止まって考えるための目安です。</dd>
            </div>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
