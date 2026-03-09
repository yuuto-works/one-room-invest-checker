import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Panel from '../../components/Panel';
import { SimulationYearRow } from '../../types';

function toManYen(rows: SimulationYearRow[]) {
  return rows.map((row) => ({
    year: row.year,
    資産価値: Math.round(row.assetValue / 10000),
    残債: Math.round(row.remainingLoan / 10000),
    累計CF: Math.round(row.cumulativeCashFlow / 10000),
    売却時損益: Math.round(row.totalProfitIfSold / 10000),
  }));
}

type Props = {
  rows: SimulationYearRow[];
};

export default function SimulationCharts({ rows }: Props) {
  const data = toManYen(rows);

  return (
    <Panel title="長期の推移" subtitle="保有期間を長めに見たときの資産価値・残債・累計CFの関係です。">
      <div className="h-[320px] w-full sm:h-[380px]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#d9e1f0" strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="万" />
            <Tooltip formatter={(value: number) => `${value.toLocaleString('ja-JP')}万円`} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="資産価値" stroke="#22314d" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="残債" stroke="#dc2626" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="累計CF" stroke="#0891b2" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="売却時損益" stroke="#16a34a" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
