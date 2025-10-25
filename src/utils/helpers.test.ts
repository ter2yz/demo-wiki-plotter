import { generateFilename } from "./helpers.js";

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
