export function roundToDigits<N extends number | undefined>(num: N, digits: number): N {
  if (num === undefined) {
    return undefined as N;
  } else {
    const rounder = Math.pow(10, digits);
    const rounded = Math.round(num as number * rounder) / rounder;
    return rounded as N;
  }
}

export function calculateRange(numbers: number[], step: number, border?: number): { minimum: number, maximum: number } {
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);

  min = Math.floor(min / step) * step;
  max = Math.ceil(max / step) * step;

  if (min === max) {
    max += step;
  }

  if (border) {
    min -= border;
    max += border;
  }

  return {
    minimum: min,
    maximum: max,
  };
}
