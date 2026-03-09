export type AreaKey =
  | 'minato'
  | 'shinjuku'
  | 'tsurumi'
  | 'nishi'
  | 'nakahara';

export type TabKey = 'checker' | 'simulation';
export type ScenarioKey = 'optimistic' | 'base' | 'pessimistic';

export type PropertyInput = {
  area: AreaKey;
  priceManYen: number;
  monthlyRent: number;
  managementFee: number;
  repairReserve: number;
  buildingAge: number;
  areaSqm: number;
  walkMinutes: number;
};

export type AreaBenchmark = {
  label: string;
  averagePricePerSqm: number;
  averageGrossYield: number;
  source: string;
  period: string;
  updatedAt: string;
};

export type ScoreResult = {
  score: number;
  label: '良好' | '要確認' | '注意' | '高リスク';
  grossYield: number;
  netYield: number;
  pricePerSqm: number;
  areaAveragePricePerSqm: number;
  priceGapPercent: number;
  reasons: string[];
  summary: string;
};

export type SimulationInput = {
  purchasePriceManYen: number;
  downPaymentManYen: number;
  annualInterestRate: number;
  loanYears: number;
  initialMonthlyRent: number;
  annualRentDeclineRate: number;
  vacancyRate: number;
  managementFeeMonthly: number;
  repairReserveMonthly: number;
  annualCostGrowthRate: number;
  annualFixedTax: number;
  annualOtherCost: number;
  majorRepairYear: number;
  majorRepairCost: number;
  annualPriceDeclineRate: number;
  sellingCostRate: number;
  holdYears: number;
};

export type SimulationYearRow = {
  year: number;
  annualIncome: number;
  annualCosts: number;
  annualLoanPayment: number;
  annualCashFlow: number;
  cumulativeCashFlow: number;
  assetValue: number;
  remainingLoan: number;
  saleNetAfterLoan: number;
  totalProfitIfSold: number;
};

export type SimulationSummary = {
  monthlyLoanPayment: number;
  salePriceAtExit: number;
  remainingLoanAtExit: number;
  saleNetAtExit: number;
  totalProfitAtExit: number;
  bestSellYear: number;
  bestSellProfit: number;
};

export type SimulationResult = {
  rows: SimulationYearRow[];
  summary: SimulationSummary;
};

export type ScenarioPreset = {
  key: ScenarioKey;
  label: string;
  description: string;
  annualRentDeclineRate: number;
  vacancyRate: number;
  annualInterestRate: number;
  annualCostGrowthRate: number;
  annualPriceDeclineRate: number;
};
