import { describe, it, expect } from "vitest";
import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("formats 0s correctly", () => {
    expect(formatTime(0)).toBe("0s");
  });

  it("formats seconds only", () => {
    expect(formatTime(9)).toBe("9s");
    expect(formatTime(59)).toBe("59s");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(60)).toBe("1m 00s");
    expect(formatTime(65)).toBe("1m 05s");
    expect(formatTime(599)).toBe("9m 59s");
  });

  it("formats hours, minutes, and seconds", () => {
    expect(formatTime(3600)).toBe("1h 00m 00s");
    expect(formatTime(3665)).toBe("1h 01m 05s");
    expect(formatTime(7322)).toBe("2h 02m 02s");
  });

  it("handles invalid inputs", () => {
    expect(formatTime(NaN)).toBe("0s");
    expect(formatTime(Infinity)).toBe("0s");
  });
});
