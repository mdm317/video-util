export type TrimRangePercent = [number, number];

export type TrimRangePercentPatch =
  | TrimRangePercent
  | [number, undefined]
  | [undefined, number];
