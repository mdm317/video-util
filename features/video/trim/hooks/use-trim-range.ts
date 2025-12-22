import { useCallback, useState } from "react";
import type { TrimRangePercent } from "@/features/video/trim/types";

type UseTrimRangeOptions = {
  initialStartPercent?: number;
  initialEndPercent?: number;
};

export const useTrimRange = (options: UseTrimRangeOptions = {}) => {
  const { initialStartPercent = 0, initialEndPercent = 100 } = options;

  const [startPercent, setStartPercent] = useState(initialStartPercent);
  const [endPercent, setEndPercent] = useState(initialEndPercent);

  const rangePercent: TrimRangePercent = [startPercent, endPercent];

  const setRangePercent = useCallback((range: TrimRangePercent) => {
    setStartPercent(range[0]);
    setEndPercent(range[1]);
  }, []);

  return {
    startPercent,
    endPercent,
    rangePercent,
    setRangePercent,
  };
};
