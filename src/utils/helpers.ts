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
