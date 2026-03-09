import { SimulationInput, SimulationResult, SimulationYearRow } from '../types';

function calculateMonthlyPayment(principalYen: number, annualRatePercent: number, years: number): number {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return principalYen / totalMonths;
  }

  return (
    (principalYen * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

function calculateRemainingLoan(principalYen: number, annualRatePercent: number, years: number, paidMonths: number): number {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = years * 12;

  if (paidMonths >= totalMonths) {
    return 0;
  }

  if (monthlyRate === 0) {
    return principalYen * (1 - paidMonths / totalMonths);
  }

  return (
    (principalYen * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, paidMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const purchasePriceYen = input.purchasePriceManYen * 10000;
  const downPaymentYen = input.downPaymentManYen * 10000;
  const principalYen = Math.max(0, purchasePriceYen - downPaymentYen);
  const monthlyPayment = calculateMonthlyPayment(principalYen, input.annualInterestRate, input.loanYears);
  const annualLoanPayment = monthlyPayment * 12;

  const rows: SimulationYearRow[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= input.holdYears; year += 1) {
    const adjustedMonthlyRent = input.initialMonthlyRent * Math.pow(1 - input.annualRentDeclineRate / 100, year - 1);
    const annualIncome = adjustedMonthlyRent * 12 * (1 - input.vacancyRate / 100);

    const adjustedManagement = input.managementFeeMonthly * 12 * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedRepair = input.repairReserveMonthly * 12 * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedTax = input.annualFixedTax * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedOther = input.annualOtherCost * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const majorRepair = year === input.majorRepairYear ? input.majorRepairCost : 0;
    const annualCosts = adjustedManagement + adjustedRepair + adjustedTax + adjustedOther + majorRepair;

    const paidMonths = Math.min(year * 12, input.loanYears * 12);
    const remainingLoan = calculateRemainingLoan(principalYen, input.annualInterestRate, input.loanYears, paidMonths);
    const currentAnnualLoanPayment = year <= input.loanYears ? annualLoanPayment : 0;
    const annualCashFlow = annualIncome - annualCosts - currentAnnualLoanPayment;
    cumulativeCashFlow += annualCashFlow;

    const assetValue = purchasePriceYen * Math.pow(1 - input.annualPriceDeclineRate / 100, year);
    const grossSale = assetValue;
    const sellingCosts = grossSale * (input.sellingCostRate / 100);
    const saleNetAfterLoan = grossSale - sellingCosts - remainingLoan;
    const totalProfitIfSold = cumulativeCashFlow + saleNetAfterLoan + downPaymentYen - purchasePriceYen;

    rows.push({
      year,
      annualIncome,
      annualCosts,
      annualLoanPayment: currentAnnualLoanPayment,
      annualCashFlow,
      cumulativeCashFlow,
      assetValue,
      remainingLoan,
      saleNetAfterLoan,
      totalProfitIfSold,
    });
  }

  const exitRow = rows[input.holdYears - 1];
  const bestRow = rows.reduce((best, current) =>
    current.totalProfitIfSold > best.totalProfitIfSold ? current : best,
  rows[0]);

  return {
    rows,
    summary: {
      monthlyLoanPayment: monthlyPayment,
      salePriceAtExit: exitRow.assetValue,
      remainingLoanAtExit: exitRow.remainingLoan,
      saleNetAtExit: exitRow.saleNetAfterLoan,
      totalProfitAtExit: exitRow.totalProfitIfSold,
      bestSellYear: bestRow.year,
      bestSellProfit: bestRow.totalProfitIfSold,
    },
  };
}
