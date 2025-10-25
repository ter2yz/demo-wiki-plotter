import {
  extractNumericValue,
  extractTables,
  isNumericColumn,
} from "../parser.js";

describe("extractNumericValue", () => {
  it("should extract decimal from measurement", () => {
    expect(extractNumericValue("1.46 m (4 ft 9¼ in)")).toBe(1.46);
    expect(extractNumericValue("1.62 m (5 ft 3¾ in)")).toBe(1.62);
  });

  it("should return null for dates", () => {
    expect(extractNumericValue("20 May 1922")).toBeNull();
    expect(extractNumericValue("August 1928")).toBeNull();
  });

  it("should return null for names", () => {
    expect(extractNumericValue("Nancy Voorhees")).toBeNull();
  });

  it("should return null for cells with links", () => {
    expect(extractNumericValue("[LINK]2014")).toBeNull();
    expect(extractNumericValue("[LINK]2014 NBA draft")).toBeNull();
  });

  it("should extract standalone decimals", () => {
    expect(extractNumericValue("1.524")).toBe(1.524);
  });

  it("should return null for references", () => {
    expect(extractNumericValue("London[1]")).toBeNull();
  });
});

describe("isNumericColumn", () => {
  it("should identify numeric column", () => {
    const data = ["1.46 m", "1.485 m", "1.524 m", "1.552 m"];
    const result = isNumericColumn(data);

    expect(result.isNumeric).toBe(true);
    expect(result.ratio).toBe(1.0);
  });

  it("should identify non-numeric column", () => {
    const data = ["Nancy Voorhees", "Elizabeth Stine", "Sophie Eliott-Lynn"];
    const result = isNumericColumn(data);

    expect(result.isNumeric).toBe(false);
    expect(result.ratio).toBe(0);
  });

  it("should handle mixed column correctly", () => {
    const data = ["1.46 m", "Nancy", "1.485 m", "Sophie"];
    const result = isNumericColumn(data);

    expect(result.isNumeric).toBe(false); // Only 50%, needs 70%
    expect(result.ratio).toBe(0.5);
  });

  it("should handle empty array", () => {
    const result = isNumericColumn([]);

    expect(result.isNumeric).toBe(false);
    expect(result.ratio).toBe(0);
  });
});

describe("extractTables", () => {
  it("should mark cells with links", () => {
    const html = `
      <table class="wikitable">
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
        <tr>
          <td>1.46 m</td>
          <td><a href="/wiki/Someone">Someone</a></td>
        </tr>
      </table>
    `;

    const tables = extractTables(html);

    expect(tables).toHaveLength(1);
    expect(tables[0]?.rows[0]?.[0]).toBe("1.46 m");
    expect(tables[0]?.rows[0]?.[1]).toContain("[LINK]");
  });
});
