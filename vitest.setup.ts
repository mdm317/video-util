import "@testing-library/jest-dom/vitest";

// Mock ResizeObserver for HeadlessUI/DndKit components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
