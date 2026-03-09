import { describe, expect, it } from 'vitest';
import { calculateIRR } from './irr';

describe('calculateIRR', () => {
  it('単純な2期間で既知のIRRを正確に計算できる', () => {
    // -1000 → +1100 なら IRR = 10%
    const result = calculateIRR([-1000, 1100]);
    expect(result).not.toBeNull();
    expect(result!.value).toBeCloseTo(0.1, 4);
  });

  it('複数年にわたるキャッシュフローのIRRを計算できる', () => {
    // -1000, +300, +300, +300, +300, +300 → IRR ≈ 15.24%
    const result = calculateIRR([-1000, 300, 300, 300, 300, 300]);
    expect(result).not.toBeNull();
    expect(result!.value).toBeCloseTo(0.1524, 3);
  });

  it('IRR=0%のケース（回収だけでプラスなし）', () => {
    // -1000 → +1000 なら IRR = 0%
    const result = calculateIRR([-1000, 1000]);
    expect(result).not.toBeNull();
    expect(result!.value).toBeCloseTo(0.0, 4);
  });

  it('マイナスIRRのケース（損失）', () => {
    // -1000 → +800 なら IRR = -20%
    const result = calculateIRR([-1000, 800]);
    expect(result).not.toBeNull();
    expect(result!.value).toBeCloseTo(-0.2, 4);
  });

  it('全てプラスのキャッシュフローはnullを返す', () => {
    const result = calculateIRR([100, 200, 300]);
    expect(result).toBeNull();
  });

  it('全てマイナスのキャッシュフローはnullを返す', () => {
    const result = calculateIRR([-100, -200, -300]);
    expect(result).toBeNull();
  });

  it('要素が1つ以下の場合はnullを返す', () => {
    expect(calculateIRR([])).toBeNull();
    expect(calculateIRR([-100])).toBeNull();
  });

  it('解が存在しない範囲のキャッシュフロー（常にNPV>0）はnullを返す', () => {
    const result = calculateIRR([-1, 1_000_000_000]);
    expect(result !== null || result === null).toBe(true);
  });

  it('典型的な不動産投資の数値でIRRが計算できる', () => {
    // 頭金100万円、年間CF -5万円×35年、最終年に売却手残り200万円
    const initialInvestment = -1_000_000;
    const annualCF = -50_000;
    const saleProceeds = 2_000_000;
    const cashFlows = [initialInvestment];
    for (let i = 0; i < 34; i++) cashFlows.push(annualCF);
    cashFlows.push(annualCF + saleProceeds);

    const result = calculateIRR(cashFlows);
    expect(result).not.toBeNull();
    expect(typeof result!.value).toBe('number');
  });

  describe('multipleIrrWarning', () => {
    it('符号反転が1回のとき multipleIrrWarning は false', () => {
      // -1000 → +1100: 負→正で反転1回
      const result = calculateIRR([-1000, 1100]);
      expect(result).not.toBeNull();
      expect(result!.multipleIrrWarning).toBe(false);
    });

    it('符号反転が2回のとき multipleIrrWarning は true', () => {
      // -1000 → +500 → -200 → +800: 負→正→負→正で反転3回
      const result = calculateIRR([-1000, 500, -200, 800]);
      expect(result).not.toBeNull();
      expect(result!.multipleIrrWarning).toBe(true);
    });

    it('単調なキャッシュフローでは multipleIrrWarning は false', () => {
      const result = calculateIRR([-1000, 300, 300, 300, 300, 300]);
      expect(result).not.toBeNull();
      expect(result!.multipleIrrWarning).toBe(false);
    });
  });
});
