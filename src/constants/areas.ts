import benchmarkData from '../data/benchmarks.json';
import { AreaBenchmark, AreaKey } from '../types';

export const AREA_OPTIONS: { value: AreaKey; label: string }[] = [
  { value: 'minato', label: '東京都港区' },
  { value: 'shinjuku', label: '東京都新宿区' },
  { value: 'tsurumi', label: '横浜市鶴見区' },
  { value: 'nishi', label: '横浜市西区' },
  { value: 'nakahara', label: '川崎市中原区' },
];

export const AREA_BENCHMARKS = benchmarkData as Record<AreaKey, AreaBenchmark>;
