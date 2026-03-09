import Panel from '../../components/Panel';
import { AREA_OPTIONS, AREA_BENCHMARKS } from '../../constants/areas';
import { PropertyInput } from '../../types';

const numberClassName =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-softblue';

type Props = {
  value: PropertyInput;
  onChange: (next: PropertyInput) => void;
};

export default function PropertyForm({ value, onChange }: Props) {
  const update = <K extends keyof PropertyInput>(key: K, nextValue: PropertyInput[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const benchmark = AREA_BENCHMARKS[value.area];

  return (
    <Panel title="物件条件" subtitle="初期値をたたき台にして、数字を直接入力できます。">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-600">エリア</span>
          <select
            className={numberClassName}
            value={value.area}
            onChange={(e) => update('area', e.target.value as PropertyInput['area'])}
          >
            {AREA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-xs leading-5 text-slate-500">
            参考相場: {benchmark.averagePricePerSqm}万円/㎡ / 参考表面利回り {benchmark.averageGrossYield}%
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {[
            ['priceManYen', '物件価格（万円）'],
            ['monthlyRent', '月額家賃（円）'],
            ['managementFee', '管理費（円）'],
            ['repairReserve', '修繕積立金（円）'],
            ['buildingAge', '築年数（年）'],
            ['areaSqm', '専有面積（㎡）'],
            ['walkMinutes', '駅徒歩（分）'],
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2">
              <span className="text-sm font-semibold text-slate-600">{label}</span>
              <input
                type="number"
                inputMode="decimal"
                className={numberClassName}
                value={value[key as keyof PropertyInput] as number}
                onChange={(e) => update(key as keyof PropertyInput, Number(e.target.value) as never)}
              />
            </label>
          ))}
        </div>
      </div>
    </Panel>
  );
}
