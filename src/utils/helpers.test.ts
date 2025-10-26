import {
  generateFilename,
  hasLink,
  looksLikeDate,
  looksMeasurement,
} from "./helpers.js";

describe("generateFilename", () => {
  it("should generate filename from simple URL", () => {
    const url = "https://en.wikipedia.org/wiki/Los_Angeles_Lakers";
    expect(generateFilename(url)).toBe("los_angeles_lakers-output.png");
  });

  it("should handle URL-encoded characters", () => {
    const url =
      "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression";
    expect(generateFilename(url)).toBe(
      "women_s_high_jump_world_record_progression-output.png"
    );
  });

  it("should handle special characters", () => {
    const url = "https://en.wikipedia.org/wiki/Test_Page_(disambiguation)";
    expect(generateFilename(url)).toBe("test_page_disambiguation-output.png");
  });

  it("should return default filename for invalid URL", () => {
    expect(generateFilename("not-a-url")).toBe("output.png");
  });
});

describe("hasLink", () => {
  it("should return true for text starting with [LINK]", () => {
    expect(hasLink("[LINK]2014")).toBe(true);
    expect(hasLink("[LINK]Some text")).toBe(true);
  });

  it("should return false for text without [LINK] prefix", () => {
    expect(hasLink("2014")).toBe(false);
    expect(hasLink("Regular text")).toBe(false);
    expect(hasLink("Text with [LINK] in middle")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(hasLink("")).toBe(false);
  });
});

describe("looksLikeDate", () => {
  it("should identify dates with month names", () => {
    expect(looksLikeDate("20 May 1922")).toBe(true);
    expect(looksLikeDate("May 20, 1922")).toBe(true);
    expect(looksLikeDate("August 1928")).toBe(true);
    expect(looksLikeDate("15 January 2024")).toBe(true);
  });

  it("should identify dates with abbreviated months", () => {
    expect(looksLikeDate("20 Jan 1922")).toBe(true);
    expect(looksLikeDate("Aug 15, 2024")).toBe(true);
    expect(looksLikeDate("15 Sept 2023")).toBe(true);
  });

  it("should identify numeric date formats", () => {
    expect(looksLikeDate("20/05/1922")).toBe(true);
    expect(looksLikeDate("20-05-1922")).toBe(true);
    expect(looksLikeDate("1922-05-20")).toBe(true);
    expect(looksLikeDate("05.20.1922")).toBe(true);
  });

  it("should return false for non-date text", () => {
    expect(looksLikeDate("1.46 m")).toBe(false);
    expect(looksLikeDate("Nancy Voorhees")).toBe(false);
    expect(looksLikeDate("2014")).toBe(false);
    expect(looksLikeDate("123")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(looksLikeDate("")).toBe(false);
  });

  it("should be case insensitive for month names", () => {
    expect(looksLikeDate("20 MAY 1922")).toBe(true);
    expect(looksLikeDate("AUGUST 1928")).toBe(true);
    expect(looksLikeDate("20 may 1922")).toBe(true);
  });
});

describe("looksMeasurement", () => {
  it("should identify metric measurements", () => {
    expect(looksMeasurement("1.46 m")).toBe(true);
    expect(looksMeasurement("100 cm")).toBe(true);
    expect(looksMeasurement("5 km")).toBe(true);
    expect(looksMeasurement("1.5 meter")).toBe(true);
    expect(looksMeasurement("2.3 metres")).toBe(true);
  });

  it("should identify imperial measurements", () => {
    expect(looksMeasurement("5 ft 2 in")).toBe(true);
    expect(looksMeasurement("6 feet")).toBe(true);
    expect(looksMeasurement("10 inch")).toBe(true);
    expect(looksMeasurement("100 yard")).toBe(true);
    expect(looksMeasurement("5 miles")).toBe(true);
  });

  it("should identify weight measurements", () => {
    expect(looksMeasurement("75 kg")).toBe(true);
    expect(looksMeasurement("150 lb")).toBe(true);
    expect(looksMeasurement("200 pound")).toBe(true);
  });

  it("should identify time measurements", () => {
    expect(looksMeasurement("30 sec")).toBe(true);
    expect(looksMeasurement("5 min")).toBe(true);
    expect(looksMeasurement("2 hour")).toBe(true);
  });

  it("should return false for non-measurement text", () => {
    expect(looksMeasurement("Nancy Voorhees")).toBe(false);
    expect(looksMeasurement("20 May 1922")).toBe(false);
    expect(looksMeasurement("2014")).toBe(false);
    expect(looksMeasurement("Los Angeles")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(looksMeasurement("")).toBe(false);
  });

  it("should be case insensitive", () => {
    expect(looksMeasurement("1.46 M")).toBe(true);
    expect(looksMeasurement("5 FT")).toBe(true);
    expect(looksMeasurement("100 CM")).toBe(true);
  });

  it("should handle measurements in complex strings", () => {
    expect(looksMeasurement("1.46 m (4 ft 9¼ in)")).toBe(true);
    expect(looksMeasurement("Height: 1.62 meter")).toBe(true);
  });
});
