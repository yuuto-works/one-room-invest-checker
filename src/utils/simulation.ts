import { getMarginalTaxRate } from '../constants/incomeRanges';
import { SimulationInput, SimulationResult, SimulationYearRow } from '../types';
import { calculateIRR } from './irr';

function calcRemainingDepreciationLife(buildingAge: number): number {
  // RC/SRC造 法定耐用年数47年前提
  const legalLife = 47;
  if (buildingAge >= legalLife) {
    return Math.max(1, Math.floor(legalLife * 0.2)); // = 9年
  }
  return Math.max(1, Math.floor(legalLife - buildingAge * 0.8));
}

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
  const purchaseExpensesYen = input.purchaseExpensesManYen * 10000;
  const initialInvestmentYen = downPaymentYen + purchaseExpensesYen;
  const principalYen = Math.max(0, purchasePriceYen - downPaymentYen);

  // 節税計算の前提
  const buildingValue = purchasePriceYen * (input.buildingRatioPercent / 100);
  const remainingDepreciationLife = calcRemainingDepreciationLife(input.buildingAgeAtPurchase);
  const annualDepreciation = buildingValue / remainingDepreciationLife;
  const marginalTaxRate = getMarginalTaxRate(input.incomeRange);
  const monthlyPayment = calculateMonthlyPayment(principalYen, input.annualInterestRate, input.loanYears);
  const annualLoanPayment = monthlyPayment * 12;

  const rows: SimulationYearRow[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= input.holdYears; year += 1) {
    const adjustedMonthlyRent = input.initialMonthlyRent * Math.pow(1 - input.annualRentChangeRate / 100, year);
    const annualIncome = adjustedMonthlyRent * 12 * (1 - input.vacancyRate / 100);

    const adjustedManagement = input.managementFeeMonthly * 12 * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedRepair = input.repairReserveMonthly * 12 * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedTax = input.annualFixedTax * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const adjustedOther = input.annualOtherCost * Math.pow(1 + input.annualCostGrowthRate / 100, year - 1);
    const majorRepair = year === input.majorRepairYear ? input.majorRepairCost : 0;
    const annualCosts = adjustedManagement + adjustedRepair + adjustedTax + adjustedOther + majorRepair;

    const prevPaidMonths = Math.min((year - 1) * 12, input.loanYears * 12);
    const paidMonths = Math.min(year * 12, input.loanYears * 12);
    const prevRemainingLoan = calculateRemainingLoan(principalYen, input.annualInterestRate, input.loanYears, prevPaidMonths);
    const remainingLoan = calculateRemainingLoan(principalYen, input.annualInterestRate, input.loanYears, paidMonths);
    const currentAnnualLoanPayment = year <= input.loanYears ? annualLoanPayment : 0;
    const annualCashFlow = annualIncome - annualCosts - currentAnnualLoanPayment;
    cumulativeCashFlow += annualCashFlow;

    // ローン利息（元利均等: 年間返済額 - 元本返済分）
    const annualInterest = year <= input.loanYears
      ? annualLoanPayment - (prevRemainingLoan - remainingLoan)
      : 0;

    // 減価償却費（償却期間を超えたらゼロ）
    const yearlyDepreciation = year <= remainingDepreciationLife ? annualDepreciation : 0;

    // 不動産所得（ローン利息・減価償却を経費算入、元本返済は含まない）
    const realEstateIncome = annualIncome - annualCosts - annualInterest - yearlyDepreciation;

    // 損益通算による節税額（赤字分のみ対象）
    const deductibleLoss = Math.max(0, -realEstateIncome);
    const taxSavings = deductibleLoss * marginalTaxRate;

    const assetValue = purchasePriceYen * Math.pow(1 - input.annualPriceChangeRate / 100, year);
    const grossSale = assetValue;
    const sellingCosts = grossSale * (input.sellingCostRate / 100);
    const taxableGain = Math.max(0, grossSale - sellingCosts - purchasePriceYen);
    const taxRate = year <= 5 ? 0.3963 : 0.20315;
    const transferTax = taxableGain * taxRate;
    const saleNetAfterLoan = grossSale - sellingCosts - remainingLoan - transferTax;
    const totalProfitIfSold = cumulativeCashFlow + saleNetAfterLoan - initialInvestmentYen;

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
      annualInterest,
      annualDepreciation: yearlyDepreciation,
      realEstateIncome,
      taxSavings,
    });
  }

  const exitRow = rows[input.holdYears - 1];
  const bestRow = rows.reduce((best, current) =>
    current.totalProfitIfSold > best.totalProfitIfSold ? current : best,
  rows[0]);
  const cumulativeTaxSavings = rows.reduce((sum, row) => sum + row.taxSavings, 0);
  const cumulativeLoanPayment = rows.reduce((sum, row) => sum + row.annualLoanPayment, 0);

  // IRR キャッシュフロー構築
  // Year 0: 頭金＋購入時諸費用の支出（ローンは各年のCFに含まれるため、初期投資はこれのみ）
  // Year 1..N: 各年の年間CF
  // Year N（最終年）: 年間CF + 売却後手残り（売却価格 - 売却費用 - 残債）
  const irrCashFlows: number[] = [-initialInvestmentYen];
  rows.forEach((row, i) => {
    if (i === rows.length - 1) {
      irrCashFlows.push(row.annualCashFlow + row.saleNetAfterLoan);
    } else {
      irrCashFlows.push(row.annualCashFlow);
    }
  });
  const irr = calculateIRR(irrCashFlows);

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
      irr,
      annualDepreciation,
      cumulativeTaxSavings,
      cumulativeLoanPayment,
    },
  };
}
