import { PropertyInput, SimulationInput } from '../types';

export const DEFAULT_PROPERTY_INPUT: PropertyInput = {
  area: 'tsurumi',
  priceManYen: 2300,
  monthlyRent: 78000,
  managementFee: 9000,
  repairReserve: 5000,
  buildingAge: 15,
  areaSqm: 21,
  walkMinutes: 8,
};

export const DEFAULT_SIMULATION_INPUT: SimulationInput = {
  purchasePriceManYen: 2300,
  downPaymentManYen: 100,
  purchaseExpensesManYen: 150,
  annualInterestRate: 1.8,
  incomeRange: '500to700',
  buildingRatioPercent: 70,
  buildingAgeAtPurchase: 15,
  loanYears: 35,
  initialMonthlyRent: 78000,
  annualRentChangeRate: 1.0,
  vacancyRate: 8.0,
  managementFeeMonthly: 9000,
  repairReserveMonthly: 5000,
  annualCostGrowthRate: 1.0,
  annualFixedTax: 85000,
  annualOtherCost: 30000,
  majorRepairYear: 15,
  majorRepairCost: 300000,
  annualPriceChangeRate: 1.0,
  sellingCostRate: 4.0,
  holdYears: 35,
};
