/**
 * Extracts page title from Wikipedia URL and creates a safe filename
 * @param url - The Wikipedia URL
 * @returns Safe filename for the output
 */
export function generateFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const pageTitle = pathParts[pathParts.length - 1]?.toLowerCase();

    if (!pageTitle) {
      return "output.png";
    }

    const decodedTitle = decodeURIComponent(pageTitle);

    // Replace special characters with underscores, keep the format clean
    const safeTitle = decodedTitle
      .replace(/'/g, "_") // Replace apostrophes
      .replace(/[^a-zA-Z0-9_-]/g, "_") // Replace other special chars
      .replace(/_+/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

    return `${safeTitle}-output.png`;
  } catch (error) {
    // If URL parsing fails, use default
    return "output.png";
  }
}

/**
 * Checks if a cell contains a link (marked during parsing)
 */
export function hasLink(text: string): boolean {
  return text.startsWith("[LINK]");
}

/**
 * Checks if a string appears to be a date
 */
export function looksLikeDate(text: string): boolean {
  const months =
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/i;
  const datePatterns = [
    /\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}/, // 20/05/1922 or 20-05-1922
    /\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}/, // 1922-05-20
    /\d{1,2}\s+\w+\s+\d{4}/, // 20 May 1922
    /\w+\s+\d{1,2},?\s+\d{4}/, // May 20, 1922
  ];

  return (
    months.test(text) || datePatterns.some((pattern) => pattern.test(text))
  );
}

/**
 * Determines if a value looks like a measurement (height, distance, etc.)
 */
export function looksMeasurement(text: string): boolean {
  const units =
    /\b(m|meters?|metres?|cm|km|ft|foot|feet|in|inch(?:es)?|miles?|yards?|yd|kg|lbs?|pounds?|secs?|mins?|hours?)\b/i;
  return units.test(text);
}
