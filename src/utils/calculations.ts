import { AREA_BENCHMARKS } from '../constants/areas';
import { PropertyInput, ScoreResult } from '../types';

const SCORE_PENALTIES = {
  lowYieldStrong: 25,
  lowYieldSoft: 10,
  highPriceStrong: 25,
  highPriceSoft: 10,
  oldBuildingStrong: 10,
  oldBuildingSoft: 5,
  heavyRunningCost: 10,
  longWalk: 10,
  smallArea: 10,
} as const;

export function calculateScore(input: PropertyInput): ScoreResult {
  const benchmark = AREA_BENCHMARKS[input.area];
  const grossYield = ((input.monthlyRent * 12) / (input.priceManYen * 10000)) * 100;
  const netYield =
    (((input.monthlyRent - input.managementFee - input.repairReserve) * 12) /
      (input.priceManYen * 10000)) *
    100;
  const pricePerSqm = input.priceManYen / input.areaSqm;
  const priceGapPercent = ((pricePerSqm - benchmark.averagePricePerSqm) / benchmark.averagePricePerSqm) * 100;
  const runningCostRatio = ((input.managementFee + input.repairReserve) / input.monthlyRent) * 100;

  let score = 100;
  const reasons: string[] = [];

  if (grossYield < 4) {
    score -= SCORE_PENALTIES.lowYieldStrong;
    reasons.push('利回りが低めです');
  } else if (grossYield < 5) {
    score -= SCORE_PENALTIES.lowYieldSoft;
    reasons.push('利回りは平均的ですが、余裕は大きくありません');
  }

  if (pricePerSqm >= benchmark.averagePricePerSqm * 1.2) {
    score -= SCORE_PENALTIES.highPriceStrong;
    reasons.push('エリア平均よりかなり割高です');
  } else if (pricePerSqm >= benchmark.averagePricePerSqm * 1.1) {
    score -= SCORE_PENALTIES.highPriceSoft;
    reasons.push('エリア平均よりやや割高です');
  }

  if (input.buildingAge >= 25) {
    score -= SCORE_PENALTIES.oldBuildingStrong;
    reasons.push('築年数が進んでいます');
  } else if (input.buildingAge >= 15) {
    score -= SCORE_PENALTIES.oldBuildingSoft;
    reasons.push('築年数はやや進んでいます');
  }

  if (runningCostRatio >= 20) {
    score -= SCORE_PENALTIES.heavyRunningCost;
    reasons.push('ランニングコストが重めです');
  }

  if (input.walkMinutes > 10) {
    score -= SCORE_PENALTIES.longWalk;
    reasons.push('駅からやや遠めです');
  }

  if (input.areaSqm < 20) {
    score -= SCORE_PENALTIES.smallArea;
    reasons.push('面積がやや小さめです');
  }

  score = Math.max(0, score);

  const label: ScoreResult['label'] =
    score >= 80 ? '良好' : score >= 60 ? '要確認' : score >= 40 ? '注意' : '高リスク';

  const summary =
    label === '良好'
      ? '大きな警戒材料は少なめです。相場とコストの前提を確認しつつ検討できます。'
      : label === '要確認'
        ? '致命的ではないものの、収益性か価格面のどちらかに確認ポイントがあります。'
        : label === '注意'
          ? '相場、利回り、コストのどれかに弱さがあります。慎重に前提を見直したい条件です。'
          : '入口時点で厳しめの条件です。買う理由より、見送る理由の確認が必要です。';

  return {
    score,
    label,
    grossYield,
    netYield,
    pricePerSqm,
    areaAveragePricePerSqm: benchmark.averagePricePerSqm,
    priceGapPercent,
    reasons,
    summary,
  };
}
