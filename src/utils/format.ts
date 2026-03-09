export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatManYen(value: number, digits = 0): string {
  return `${value.toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}万円`;
}

export function formatYen(value: number): string {
  return `${Math.round(value).toLocaleString('ja-JP')}円`;
}

export function formatSignedManYen(value: number, digits = 0): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}万円`;
}
