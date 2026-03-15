import Panel from '../../components/Panel';
import { INCOME_RANGE_OPTIONS } from '../../constants/incomeRanges';
import { IncomeRange, SimulationInput } from '../../types';

const fieldClassName =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-softblue';

type NumericFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
};

function NumericField({
  label,
  value,
  onChange,
  suffix,
  hint,
  min,
  max,
  step = 1,
  slider = false,
  sliderMin,
  sliderMax,
  sliderStep,
}: NumericFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <div className="grid gap-3">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            className={`${fieldClassName} pr-16`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>
        </div>
        {slider ? (
          <input
            type="range"
            min={sliderMin ?? min ?? 0}
            max={sliderMax ?? max ?? 100}
            step={sliderStep ?? step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        ) : null}
      </div>
      {hint && <span className="text-xs leading-5 text-slate-400">{hint}</span>}
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 border-b border-line pb-1 pt-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{children}</span>
    </div>
  );
}

type Props = {
  value: SimulationInput;
  onChange: (next: SimulationInput) => void;
};

export default function SimulationForm({ value, onChange }: Props) {
  const update = <K extends keyof SimulationInput>(key: K, nextValue: SimulationInput[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <Panel title="長期収支の前提" subtitle="シナリオで初期値を入れたあと、数字を直接微調整できます。">
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">

          <SectionLabel>購入・ローン</SectionLabel>
          <NumericField
            label="購入価格" value={value.purchasePriceManYen}
            onChange={(v) => update('purchasePriceManYen', v)} suffix="万円"
          />
          <NumericField
            label="頭金" value={value.downPaymentManYen}
            onChange={(v) => update('downPaymentManYen', v)} suffix="万円"
            hint="購入価格の10〜20%が目安"
          />
          <NumericField
            label="購入時諸費用" value={value.purchaseExpensesManYen}
            onChange={(v) => update('purchaseExpensesManYen', v)} suffix="万円"
            hint="仲介手数料・登記費用等、購入価格の6〜8%が目安"
          />
          <NumericField
            label="金利" value={value.annualInterestRate}
            onChange={(v) => update('annualInterestRate', v)} suffix="%" step={0.1}
            slider sliderMin={0} sliderMax={5} sliderStep={0.1}
            hint="変動金利の現状は1〜2%台"
          />
          <NumericField
            label="返済年数" value={value.loanYears}
            onChange={(v) => update('loanYears', v)} suffix="年" min={1} max={40}
            slider sliderMin={5} sliderMax={40} sliderStep={1}
            hint="一般的には25〜35年"
          />

          <SectionLabel>家賃・空室</SectionLabel>
          <NumericField
            label="月額家賃" value={value.initialMonthlyRent}
            onChange={(v) => update('initialMonthlyRent', v)} suffix="円"
          />
          <NumericField
            label="家賃変動率（−で上昇・＋で下落）" value={value.annualRentChangeRate}
            onChange={(v) => update('annualRentChangeRate', v)} suffix="%" step={0.1}
            slider sliderMin={-3} sliderMax={5} sliderStep={0.1}
            hint="一般的に築年経過で年0.5〜2%下落。マイナス値は上昇を意味し、東京・大阪都心の駅徒歩5分以内・築浅の超好立地に限り微増の可能性あり（全国大多数の物件は当てはまりません）"
          />
          <NumericField
            label="空室率" value={value.vacancyRate}
            onChange={(v) => update('vacancyRate', v)} suffix="%" step={0.5}
            slider sliderMin={0} sliderMax={30} sliderStep={0.5}
            hint="投資用ワンルームの目安は5〜15%"
          />

          <SectionLabel>運営コスト</SectionLabel>
          <NumericField
            label="管理費（管理組合）" value={value.managementFeeMonthly}
            onChange={(v) => update('managementFeeMonthly', v)} suffix="円/月"
            hint="管理組合への月額費用。賃貸管理委託料（家賃の5〜7%）は別途「その他コスト」に加算してください"
          />
          <NumericField
            label="修繕積立金" value={value.repairReserveMonthly}
            onChange={(v) => update('repairReserveMonthly', v)} suffix="円/月"
          />
          <NumericField
            label="コスト上昇率" value={value.annualCostGrowthRate}
            onChange={(v) => update('annualCostGrowthRate', v)} suffix="%" step={0.1}
            slider sliderMin={0} sliderMax={5} sliderStep={0.1}
            hint="インフレ等で年1〜2%が目安"
          />
          <NumericField
            label="固定資産税等" value={value.annualFixedTax}
            onChange={(v) => update('annualFixedTax', v)} suffix="円/年"
            hint="物件価格の0.3〜0.5%/年が目安"
          />
          <NumericField
            label="その他コスト" value={value.annualOtherCost}
            onChange={(v) => update('annualOtherCost', v)} suffix="円/年"
          />

          <SectionLabel>大規模修繕</SectionLabel>
          <NumericField
            label="大規模修繕年" value={value.majorRepairYear}
            onChange={(v) => update('majorRepairYear', v)} suffix="年目" min={1} max={40}
            slider sliderMin={1} sliderMax={40} sliderStep={1}
            hint="築15〜20年頃に多い"
          />
          <NumericField
            label="大規模修繕費" value={value.majorRepairCost}
            onChange={(v) => update('majorRepairCost', v)} suffix="円"
            hint="設備交換等で30〜100万円が目安"
          />

          <SectionLabel>節税試算</SectionLabel>
          <label className="grid gap-2 col-span-2">
            <span className="text-sm font-semibold text-slate-600">給与年収帯</span>
            <select
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-softblue"
              value={value.incomeRange}
              onChange={(e) => update('incomeRange', e.target.value as IncomeRange)}
            >
              {INCOME_RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}（実効税率 {Math.round(o.marginalTaxRate * 100)}%）
                </option>
              ))}
            </select>
            <span className="text-xs leading-5 text-slate-400">給与所得との損益通算で戻ってくる税金の目安を算出します</span>
          </label>
          <NumericField
            label="建物割合" value={value.buildingRatioPercent}
            onChange={(v) => update('buildingRatioPercent', v)} suffix="%" step={1}
            slider sliderMin={50} sliderMax={90} sliderStep={1}
            hint="土地・建物の按分。区分マンションは60〜80%が目安"
          />
          <NumericField
            label="築年数（購入時）" value={value.buildingAgeAtPurchase}
            onChange={(v) => update('buildingAgeAtPurchase', v)} suffix="年" min={0} max={60}
            slider sliderMin={0} sliderMax={60} sliderStep={1}
            hint="減価償却の残存耐用年数の計算に使います（RC造47年前提）"
          />

          <SectionLabel>売却・出口</SectionLabel>
          <NumericField
            label="資産価値変動率（−で上昇・＋で下落）" value={value.annualPriceChangeRate}
            onChange={(v) => update('annualPriceChangeRate', v)} suffix="%" step={0.1}
            slider sliderMin={-3} sliderMax={5} sliderStep={0.1}
            hint="一般的に都心0.5〜1%・郊外1〜3%下落。マイナス値は上昇を意味し、東京・大阪都心の主要駅近・築浅物件に限り微増の可能性あり（全国大多数の物件は当てはまりません）"
          />
          <NumericField
            label="売却コスト率" value={value.sellingCostRate}
            onChange={(v) => update('sellingCostRate', v)} suffix="%" step={0.1}
            slider sliderMin={0} sliderMax={10} sliderStep={0.1}
            hint="仲介手数料等、一般的に3〜4%"
          />
          <NumericField
            label="保有年数" value={value.holdYears}
            onChange={(v) => update('holdYears', v)} suffix="年" min={1} max={45}
            slider sliderMin={1} sliderMax={45} sliderStep={1}
          />

        </div>
      </div>
    </Panel>
  );
}
