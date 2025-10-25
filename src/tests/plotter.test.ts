import { generateChart } from "../plotter.js";
import type { NumericColumn } from "../types.js";

describe("generateChart", () => {
  const mockData: NumericColumn = {
    columnIndex: 0,
    columnName: "Test Values",
    values: [1.46, 1.485, 1.524, 1.552, 1.58],
    rawValues: ["1.46 m", "1.485 m", "1.524 m", "1.552 m", "1.58 m"],
  };

  it("should generate a chart buffer", async () => {
    const buffer = await generateChart(mockData);

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should accept custom configuration", async () => {
    const buffer = await generateChart(mockData, {
      width: 400,
      height: 300,
      title: "Custom Title",
    });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should handle empty data gracefully", async () => {
    const emptyData: NumericColumn = {
      columnIndex: 0,
      columnName: "Empty",
      values: [],
      rawValues: [],
    };

    const buffer = await generateChart(emptyData);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
