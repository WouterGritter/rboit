export function roundToDigits<N extends number | undefined>(num: N, digits: number): N {
  if (num === undefined) {
    return undefined as N;
  } else {
    const rounder = Math.pow(10, digits);
    const rounded = Math.round(num as number * rounder) / rounder;
    return rounded as N;
  }
}

export function calculateRange(numbers: number[], roundToClosestTo: number): { minimum: number, maximum: number } {
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);

  min = Math.floor(min / roundToClosestTo) * roundToClosestTo;
  max = Math.ceil(max / roundToClosestTo) * roundToClosestTo;

  if (min === max) {
    max += roundToClosestTo;
  }

  return {
    minimum: min,
    maximum: max,
  };
}
