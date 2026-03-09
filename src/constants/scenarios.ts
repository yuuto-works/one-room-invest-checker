import { ScenarioPreset } from '../types';

export const SCENARIOS: ScenarioPreset[] = [
  {
    key: 'optimistic',
    label: '楽観',
    description: '家賃維持寄り・空室少なめ',
    annualRentDeclineRate: 0.0,
    vacancyRate: 3.0,
    annualInterestRate: 1.2,
    annualCostGrowthRate: 0.5,
    annualPriceDeclineRate: 0.5,
  },
  {
    key: 'base',
    label: '標準',
    description: '現実寄りのベースケース',
    annualRentDeclineRate: 1.0,
    vacancyRate: 8.0,
    annualInterestRate: 1.8,
    annualCostGrowthRate: 1.0,
    annualPriceDeclineRate: 1.0,
  },
  {
    key: 'pessimistic',
    label: '悲観',
    description: '空室・下落・コスト増を強めに想定',
    annualRentDeclineRate: 2.0,
    vacancyRate: 15.0,
    annualInterestRate: 2.8,
    annualCostGrowthRate: 2.0,
    annualPriceDeclineRate: 2.0,
  },
];
