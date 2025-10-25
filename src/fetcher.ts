import axios, { type AxiosResponse } from "axios";

/**
 * Fetches HTML content from a given URL
 * @param url - The Wikipedia URL to fetch
 * @returns The HTML content as a string
 * @throws Error if the fetch fails
 */
export async function fetchPage(url: string): Promise<string> {
  try {
    console.log("Fetching page...");

    // Validate URL
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    if (!url.includes("wikipedia.org")) {
      throw new Error("URL must be a Wikipedia page");
    }

    // Fetch the page
    const response: AxiosResponse<string> = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Educational Project) WikiTablePlotter/1.0",
      },
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch page: HTTP ${response.status}`);
    }

    console.log("✓ Page fetched successfully");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ENOTFOUND") {
        throw new Error(
          "Could not connect to Wikipedia. Check your internet connection."
        );
      }
      if (error.code === "ETIMEDOUT") {
        throw new Error("Request timed out. Please try again.");
      }
    }

    if (error instanceof Error) {
      throw new Error(`Failed to fetch page: ${error.message}`);
    }

    throw new Error("An unknown error occurred while fetching the page");
  }
}
