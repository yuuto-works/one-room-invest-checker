/**
 * IRR（内部収益率）計算ユーティリティ
 *
 * 二分法（Bisection method）で NPV = 0 となる割引率を求める。
 * - 収束しない／解なしの場合は null を返す
 * - cashFlows[0] が Year 0 の初期投資（通常マイナス）
 * - cashFlows[t] が t 年目のキャッシュフロー（t ≥ 1）
 * - キャッシュフローの符号反転が2回以上の場合、IRRが複数存在しうるため
 *   multipleIrrWarning: true を付与する
 */

export type IrrResult = {
  value: number;
  multipleIrrWarning: boolean;
};

function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

export function calculateIRR(cashFlows: number[]): IrrResult | null {
  if (cashFlows.length < 2) return null;

  const hasNegative = cashFlows.some((cf) => cf < 0);
  const hasPositive = cashFlows.some((cf) => cf > 0);
  if (!hasNegative || !hasPositive) return null;

  // 符号反転回数を数える（2回以上で複数解の可能性）
  const signChanges = cashFlows.slice(1).reduce((count, cf, i) => {
    return cashFlows[i] * cf < 0 ? count + 1 : count;
  }, 0);
  const multipleIrrWarning = signChanges > 1;

  // 探索範囲: -99% 〜 +1000%（現実的な不動産投資をカバー）
  const lo = -0.99;
  const hi = 10.0;

  const npvLo = npv(lo, cashFlows);
  const npvHi = npv(hi, cashFlows);

  // 両端で符号が同じ → 区間内に解なし
  if (npvLo * npvHi > 0) return null;

  let lower = lo;
  let upper = hi;

  for (let i = 0; i < 300; i++) {
    const mid = (lower + upper) / 2;
    const npvMid = npv(mid, cashFlows);

    if ((upper - lower) / 2 < 1e-10) {
      return { value: mid, multipleIrrWarning };
    }

    if (npv(lower, cashFlows) * npvMid < 0) {
      upper = mid;
    } else {
      lower = mid;
    }
  }

  return { value: (lower + upper) / 2, multipleIrrWarning };
}
