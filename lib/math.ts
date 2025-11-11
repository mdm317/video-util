export const round = (value: number, decimalPlaces = 0): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
};