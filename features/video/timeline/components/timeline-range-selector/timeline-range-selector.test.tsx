import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TimelineRangeSelector from "./timeline-range-selector";

vi.mock("@/hooks/use-size", () => ({
  useSize: vi.fn(() => ({ width: 100 })),
}));

describe("TimelineRangeSelector", () => {
  let mockSetRangePercent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetRangePercent = vi.fn();
  });

  it("renders draggable elements", () => {
    render(
      <TimelineRangeSelector range={[10, 90]} onChange={mockSetRangePercent} />,
    );

    expect(screen.getByTestId("left-drag")).toBeInTheDocument();
    expect(screen.getByTestId("right-drag")).toBeInTheDocument();
  });

  it("clamps start value to 0 when dragged beyond container", () => {
    render(
      <TimelineRangeSelector range={[10, 90]} onChange={mockSetRangePercent} />,
    );

    const leftDrag = screen.getByTestId("left-drag");
    fireEvent.mouseDown(leftDrag, { clientX: 10 });
    fireEvent.mouseMove(leftDrag, { clientX: -50 });
    fireEvent.mouseUp(leftDrag);

    expect(mockSetRangePercent).toHaveBeenLastCalledWith([0, 90]);
  });

  it("prevents start value from exceeding end value", () => {
    render(
      <TimelineRangeSelector range={[10, 90]} onChange={mockSetRangePercent} />,
    );

    const leftDrag = screen.getByTestId("left-drag");
    fireEvent.mouseDown(leftDrag, { clientX: 10 });
    fireEvent.mouseMove(leftDrag, { clientX: 95 });
    fireEvent.mouseUp(leftDrag);

    expect(mockSetRangePercent).toHaveBeenLastCalledWith([87, 90]);
  });

  it("clamps end value to 100 when dragged beyond container", () => {
    render(
      <TimelineRangeSelector range={[10, 90]} onChange={mockSetRangePercent} />,
    );

    const rightDrag = screen.getByTestId("right-drag");
    fireEvent.mouseDown(rightDrag, { clientX: 90 });
    fireEvent.mouseMove(rightDrag, { clientX: 150 });
    fireEvent.mouseUp(rightDrag);

    expect(mockSetRangePercent).toHaveBeenLastCalledWith([10, 100]);
  });

  it("prevents end value from going below start value", () => {
    render(
      <TimelineRangeSelector range={[10, 90]} onChange={mockSetRangePercent} />,
    );

    const rightDrag = screen.getByTestId("right-drag");
    fireEvent.mouseDown(rightDrag, { clientX: 90 });
    fireEvent.mouseMove(rightDrag, { clientX: 5 });
    fireEvent.mouseUp(rightDrag);

    expect(mockSetRangePercent).toHaveBeenLastCalledWith([10, 13]);
  });
});
