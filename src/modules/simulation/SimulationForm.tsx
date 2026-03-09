import Panel from '../../components/Panel';
import { SimulationInput } from '../../types';

const fieldClassName =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-softblue';

type NumericFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
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
    </label>
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <NumericField label="購入価格" value={value.purchasePriceManYen} onChange={(v) => update('purchasePriceManYen', v)} suffix="万円" />
          <NumericField label="頭金" value={value.downPaymentManYen} onChange={(v) => update('downPaymentManYen', v)} suffix="万円" />
          <NumericField label="金利" value={value.annualInterestRate} onChange={(v) => update('annualInterestRate', v)} suffix="%" step={0.1} slider sliderMin={0} sliderMax={5} sliderStep={0.1} />
          <NumericField label="返済年数" value={value.loanYears} onChange={(v) => update('loanYears', v)} suffix="年" min={1} max={40} slider sliderMin={5} sliderMax={40} sliderStep={1} />
          <NumericField label="月額家賃" value={value.initialMonthlyRent} onChange={(v) => update('initialMonthlyRent', v)} suffix="円" />
          <NumericField label="家賃下落率" value={value.annualRentDeclineRate} onChange={(v) => update('annualRentDeclineRate', v)} suffix="%" step={0.1} slider sliderMin={0} sliderMax={5} sliderStep={0.1} />
          <NumericField label="空室率" value={value.vacancyRate} onChange={(v) => update('vacancyRate', v)} suffix="%" step={0.5} slider sliderMin={0} sliderMax={30} sliderStep={0.5} />
          <NumericField label="管理費" value={value.managementFeeMonthly} onChange={(v) => update('managementFeeMonthly', v)} suffix="円/月" />
          <NumericField label="修繕積立金" value={value.repairReserveMonthly} onChange={(v) => update('repairReserveMonthly', v)} suffix="円/月" />
          <NumericField label="コスト上昇率" value={value.annualCostGrowthRate} onChange={(v) => update('annualCostGrowthRate', v)} suffix="%" step={0.1} slider sliderMin={0} sliderMax={5} sliderStep={0.1} />
          <NumericField label="固定資産税等" value={value.annualFixedTax} onChange={(v) => update('annualFixedTax', v)} suffix="円/年" />
          <NumericField label="その他コスト" value={value.annualOtherCost} onChange={(v) => update('annualOtherCost', v)} suffix="円/年" />
          <NumericField label="大規模修繕年" value={value.majorRepairYear} onChange={(v) => update('majorRepairYear', v)} suffix="年目" min={1} max={40} slider sliderMin={1} sliderMax={40} sliderStep={1} />
          <NumericField label="大規模修繕費" value={value.majorRepairCost} onChange={(v) => update('majorRepairCost', v)} suffix="円" />
          <NumericField label="資産価値下落率" value={value.annualPriceDeclineRate} onChange={(v) => update('annualPriceDeclineRate', v)} suffix="%" step={0.1} slider sliderMin={0} sliderMax={5} sliderStep={0.1} />
          <NumericField label="売却コスト率" value={value.sellingCostRate} onChange={(v) => update('sellingCostRate', v)} suffix="%" step={0.1} slider sliderMin={0} sliderMax={10} sliderStep={0.1} />
          <NumericField label="保有年数" value={value.holdYears} onChange={(v) => update('holdYears', v)} suffix="年" min={1} max={40} slider sliderMin={1} sliderMax={40} sliderStep={1} />
        </div>
      </div>
    </Panel>
  );
}
