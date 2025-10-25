import { fetchPage } from "../fetcher.js";

describe("fetchPage", () => {
  it("should fetch a valid Wikipedia page", async () => {
    const url =
      "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression";
    const html = await fetchPage(url);

    expect(html).toBeDefined();
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("<table");
  }, 15000); // 15 second timeout for network request

  it("should throw error for invalid URL", async () => {
    await expect(fetchPage("not-a-url")).rejects.toThrow(
      "URL must be a Wikipedia page"
    );
  });

  it("should throw error for empty URL", async () => {
    await expect(fetchPage("")).rejects.toThrow("Invalid URL provided");
  });
});
