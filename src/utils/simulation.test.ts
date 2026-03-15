import { describe, expect, it } from 'vitest';
import { DEFAULT_SIMULATION_INPUT } from '../constants/defaults';
import { SimulationInput } from '../types';
import { runSimulation } from './simulation';

const BASE: SimulationInput = {
  ...DEFAULT_SIMULATION_INPUT,
  holdYears: 10,
};

describe('runSimulation', () => {
  describe('基本動作', () => {
    it('holdYears分の行を返す', () => {
      const result = runSimulation({ ...BASE, holdYears: 20 });
      expect(result.rows).toHaveLength(20);
    });

    it('各行のyearが1始まりで連番になっている', () => {
      const result = runSimulation(BASE);
      result.rows.forEach((row, i) => {
        expect(row.year).toBe(i + 1);
      });
    });

    it('累計CFが各行の年間CFの累積と一致する', () => {
      const result = runSimulation(BASE);
      let running = 0;
      result.rows.forEach((row) => {
        running += row.annualCashFlow;
        expect(row.cumulativeCashFlow).toBeCloseTo(running, 0);
      });
    });
  });

  describe('ローン計算', () => {
    it('金利0%のとき月返済額は元本/返済月数になる', () => {
      const input: SimulationInput = {
        ...BASE,
        purchasePriceManYen: 2000,
        downPaymentManYen: 0,
        annualInterestRate: 0,
        loanYears: 20,
      };
      const result = runSimulation(input);
      const expected = (2000 * 10000) / (20 * 12);
      expect(result.summary.monthlyLoanPayment).toBeCloseTo(expected, 0);
    });

    it('頭金が購入価格と同額のとき、ローン返済額はゼロ', () => {
      const input: SimulationInput = {
        ...BASE,
        purchasePriceManYen: 2000,
        downPaymentManYen: 2000,
      };
      const result = runSimulation(input);
      expect(result.summary.monthlyLoanPayment).toBeCloseTo(0, 0);
    });

    it('保有年数がローン年数を超えても残債はゼロのまま', () => {
      const input: SimulationInput = {
        ...BASE,
        loanYears: 5,
        holdYears: 10,
      };
      const result = runSimulation(input);
      // 6年目以降の残債はゼロ
      result.rows.slice(5).forEach((row) => {
        expect(row.remainingLoan).toBeCloseTo(0, 0);
      });
    });

    it('ローン完済後は年間ローン返済額がゼロになる', () => {
      const input: SimulationInput = {
        ...BASE,
        loanYears: 5,
        holdYears: 10,
      };
      const result = runSimulation(input);
      result.rows.slice(5).forEach((row) => {
        expect(row.annualLoanPayment).toBe(0);
      });
    });
  });

  describe('家賃・空室', () => {
    it('家賃下落率0%のとき初年度と最終年度の年間収入が同額', () => {
      const input: SimulationInput = {
        ...BASE,
        annualRentChangeRate: 0,
        vacancyRate: 0,
      };
      const result = runSimulation(input);
      expect(result.rows[0].annualIncome).toBeCloseTo(result.rows[result.rows.length - 1].annualIncome, 0);
    });

    it('家賃下落率が正のとき年間収入は年々減少する', () => {
      const input: SimulationInput = {
        ...BASE,
        annualRentChangeRate: 2.0,
        vacancyRate: 0,
      };
      const result = runSimulation(input);
      for (let i = 1; i < result.rows.length; i++) {
        expect(result.rows[i].annualIncome).toBeLessThan(result.rows[i - 1].annualIncome);
      }
    });

    it('空室率100%のとき年間収入がゼロ', () => {
      const input: SimulationInput = {
        ...BASE,
        vacancyRate: 100,
      };
      const result = runSimulation(input);
      result.rows.forEach((row) => {
        expect(row.annualIncome).toBeCloseTo(0, 0);
      });
    });
  });

  describe('資産価値', () => {
    it('価格下落率0%のとき資産価値は購入価格のまま', () => {
      const input: SimulationInput = {
        ...BASE,
        annualPriceChangeRate: 0,
      };
      const purchasePriceYen = input.purchasePriceManYen * 10000;
      const result = runSimulation(input);
      result.rows.forEach((row) => {
        expect(row.assetValue).toBeCloseTo(purchasePriceYen, 0);
      });
    });

    it('価格下落率が正のとき資産価値は年々減少する', () => {
      const input: SimulationInput = {
        ...BASE,
        annualPriceChangeRate: 1.5,
      };
      const result = runSimulation(input);
      for (let i = 1; i < result.rows.length; i++) {
        expect(result.rows[i].assetValue).toBeLessThan(result.rows[i - 1].assetValue);
      }
    });
  });

  describe('大規模修繕', () => {
    it('大規模修繕年のコストに修繕費が加算されている', () => {
      const input: SimulationInput = {
        ...BASE,
        majorRepairYear: 5,
        majorRepairCost: 500000,
      };
      const result = runSimulation(input);
      const repairRow = result.rows[4]; // year 5
      const nonRepairRow = result.rows[3]; // year 4（修繕なし・コスト成長率考慮）
      expect(repairRow.annualCosts).toBeGreaterThan(nonRepairRow.annualCosts);
    });

    it('大規模修繕年以外には修繕費が加算されない', () => {
      const input: SimulationInput = {
        ...BASE,
        majorRepairYear: 5,
        majorRepairCost: 500000,
        annualCostGrowthRate: 0,
      };
      const result = runSimulation(input);
      const repairRow = result.rows[4];
      const afterRow = result.rows[5];
      // 修繕年翌年のコストは修繕費なし分だけ安い
      expect(afterRow.annualCosts).toBeLessThan(repairRow.annualCosts);
    });
  });

  describe('totalProfitIfSold の正確性', () => {
    it('既知の数値で totalProfitIfSold が正しく計算される', () => {
      // シンプルなケース（金利0%・コストゼロ・価格下落なし・売却費用なし）で手計算と照合
      // 購入2000万, 頭金200万, 借入1800万, 返済10年, 月家賃5万, 保有1年
      // Year1: annualCF = 60万 - 0 - 180万 = -120万
      // saleNetAfterLoan = 2000万 - 0 - (1800万 - 180万) = 2000万 - 1620万 = 380万
      // 正しいtotalProfit = -120万 + 380万 - 200万 = +60万円
      const input: SimulationInput = {
        purchasePriceManYen: 2000,
        downPaymentManYen: 200,
        purchaseExpensesManYen: 0,
        annualInterestRate: 0,
        incomeRange: '500to700',
        buildingRatioPercent: 70,
        buildingAgeAtPurchase: 15,
        loanYears: 10,
        initialMonthlyRent: 50000,
        annualRentChangeRate: 0,
        vacancyRate: 0,
        managementFeeMonthly: 0,
        repairReserveMonthly: 0,
        annualCostGrowthRate: 0,
        annualFixedTax: 0,
        annualOtherCost: 0,
        majorRepairYear: 99,
        majorRepairCost: 0,
        annualPriceChangeRate: 0,
        sellingCostRate: 0,
        holdYears: 1,
      };
      const result = runSimulation(input);
      // 期待値: +60万円 = 600,000円
      expect(result.rows[0].totalProfitIfSold).toBeCloseTo(600000, 0);
    });

    it('全額現金購入(頭金=購入価格)のとき、ローン返済なしで損益が正しく計算される', () => {
      // 現金購入: 頭金 = 購入価格, ローンなし
      // 購入1000万, 月家賃4万, 1年後売却
      // Year1: annualCF = 48万, saleNetAfterLoan = 1000万(価格下落なし・売却費用なし)
      // 正しいtotalProfit = 48万 + 1000万 - 1000万 = +48万円
      const input: SimulationInput = {
        purchasePriceManYen: 1000,
        downPaymentManYen: 1000,
        purchaseExpensesManYen: 0,
        annualInterestRate: 0,
        incomeRange: '500to700',
        buildingRatioPercent: 70,
        buildingAgeAtPurchase: 15,
        loanYears: 10,
        initialMonthlyRent: 40000,
        annualRentChangeRate: 0,
        vacancyRate: 0,
        managementFeeMonthly: 0,
        repairReserveMonthly: 0,
        annualCostGrowthRate: 0,
        annualFixedTax: 0,
        annualOtherCost: 0,
        majorRepairYear: 99,
        majorRepairCost: 0,
        annualPriceChangeRate: 0,
        sellingCostRate: 0,
        holdYears: 1,
      };
      const result = runSimulation(input);
      // 期待値: 480,000円
      expect(result.rows[0].totalProfitIfSold).toBeCloseTo(480000, 0);
    });
  });

  describe('summary', () => {
    it('salePriceAtExitはholdYears年目の資産価値と一致する', () => {
      const result = runSimulation(BASE);
      const exitRow = result.rows[BASE.holdYears - 1];
      expect(result.summary.salePriceAtExit).toBeCloseTo(exitRow.assetValue, 0);
    });

    it('totalProfitAtExitはholdYears年目のtotalProfitIfSoldと一致する', () => {
      const result = runSimulation(BASE);
      const exitRow = result.rows[BASE.holdYears - 1];
      expect(result.summary.totalProfitAtExit).toBeCloseTo(exitRow.totalProfitIfSold, 0);
    });

    it('bestSellYearはtotalProfitIfSoldが最大の年', () => {
      const result = runSimulation(BASE);
      const maxProfit = Math.max(...result.rows.map((r) => r.totalProfitIfSold));
      const bestRow = result.rows.find((r) => r.year === result.summary.bestSellYear)!;
      expect(bestRow.totalProfitIfSold).toBeCloseTo(maxProfit, 0);
    });

    it('irrがnullまたはIrrResult型を返す', () => {
      const result = runSimulation(BASE);
      const irr = result.summary.irr;
      if (irr !== null) {
        expect(typeof irr.value).toBe('number');
        expect(typeof irr.multipleIrrWarning).toBe('boolean');
      } else {
        expect(irr).toBeNull();
      }
    });
  });
});
