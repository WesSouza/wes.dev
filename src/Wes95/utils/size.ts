export function clamp(
  min: number | undefined,
  value: number,
  max?: number | undefined,
) {
  if (min !== undefined && value < min) {
    return min;
  }
  if (max !== undefined && value > max) {
    return max;
  }
  return value;
}
