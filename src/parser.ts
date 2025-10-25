import * as cheerio from "cheerio";

import type { NumericColumn, ParsedTable } from "./types.js";

/**
 * Extracts all tables from HTML content
 * @param html - The HTML content to parse
 * @returns Array of parsed tables
 */
export function extractTables(html: string): ParsedTable[] {
  console.log("🔍 Parsing HTML for tables...");

  const $ = cheerio.load(html);
  const tables: ParsedTable[] = [];

  $("table.wikitable").each((_, element) => {
    const headers: string[] = [];
    const rows: string[][] = [];

    // Extract headers
    $(element)
      .find("thead tr th, tr:first-child th")
      .each((_, th) => {
        headers.push($(th).text().trim());
      });

    // If no headers found in thead, check first row of tbody
    if (headers.length === 0) {
      $(element)
        .find("tbody tr:first-child td")
        .each((_, td) => {
          headers.push($(td).text().trim());
        });
    }

    // Extract rows
    $(element)
      .find("tbody tr, tr")
      .each((_, tr) => {
        const row: string[] = [];
        const $tr = $(tr);

        // Skip header rows
        if ($tr.find("th").length > 0 && $tr.find("td").length === 0) {
          return;
        }

        $tr.find("td").each((_, td) => {
          const $td = $(td);

          // Check if this cell contains a link
          const hasLink = $td.find("a").length > 0;
          if (hasLink) {
            row.push(`[LINK]${$td.text().trim()}`);
          } else {
            row.push($(td).text().trim());
          }
        });

        if (row.length > 0) {
          rows.push(row);
        }
      });

    if (headers.length > 0 && rows.length > 0) {
      tables.push({ headers, rows });
      console.log(
        `  Found table with ${headers.length} columns and ${rows.length} rows`
      );
    }
  });

  console.log(`✓ Found ${tables.length} table(s)`);
  return tables;
}

/**
 * Extracts numeric value from a string
 * Examples:
 *   "1.46 m (4 ft 9¼ in)" -> 1.46
 *   "20 May 1922" -> 20 (but we'll filter this out as a date)
 *   "Nancy Voorhees" -> null
 */
export function extractNumericValue(text: string): number | null {
  // filter out links
  if (hasLink(text)) {
    return null;
  }

  // filter out dates
  if (looksLikeDate(text)) {
    return null;
  }

  // filter out reference citations
  if (text.includes("[") && text.includes("]")) {
    return null;
  }

  // PRIORITY 1: Measurements
  if (looksMeasurement(text)) {
    const match = text.match(/(\d+\.?\d*)\s*[a-zA-Z]/);
    if (match) {
      const num = parseFloat(match[1] ?? "");
      if (!isNaN(num) && isFinite(num)) {
        return num;
      }
    }
  }

  // PRIORITY 2: Decimal numbers
  const decimalMatch = text.match(/\b\d+\.\d+\b/);
  if (decimalMatch) {
    const num = parseFloat(decimalMatch[0]);
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  // PRIORITY 3: Integer numbers (cautiously)
  const integerMatch = text.match(/\b(\d+)\b/);
  if (integerMatch) {
    const num = parseInt(integerMatch[1] ?? "", 10);

    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  return null;
}

/**
 * Determines if a column contains primarily numeric data
 * @param columnData - Array of cell values from a column
 * @returns Object with isNumeric flag and numeric ratio
 */
export function isNumericColumn(columnData: string[]): {
  isNumeric: boolean;
  ratio: number;
} {
  if (columnData.length === 0) {
    return { isNumeric: false, ratio: 0 };
  }

  let numericCount = 0;

  for (const cell of columnData) {
    const value = extractNumericValue(cell);
    if (value !== null) {
      numericCount++;
    }
  }

  const ratio = numericCount / columnData.length;

  // Consider it numeric if at least 70% of cells contain numbers
  return {
    isNumeric: ratio >= 0.7,
    ratio,
  };
}

/**
 * Finds the best numeric column in a table
 * Prioritizes columns with highest numeric ratio
 */
export function findNumericColumn(table: ParsedTable): NumericColumn | null {
  console.log("🔢 Analyzing columns for numeric data...");

  if (table.rows.length === 0) {
    return null;
  }

  const numColumns = table.headers.length || table.rows[0]?.length || 0;
  let bestColumn: NumericColumn | null = null;
  let bestRatio = 0;

  // Check each column
  for (let colIndex = 0; colIndex < numColumns; colIndex++) {
    const columnData = table.rows.map((row) => row[colIndex] || "");
    const { isNumeric, ratio } = isNumericColumn(columnData);

    console.log(
      `  Column ${colIndex} (${table.headers[colIndex] || "unnamed"}): ${(ratio * 100).toFixed(0)}% numeric`
    );

    if (isNumeric && ratio > bestRatio) {
      // Extract all numeric values
      const values: number[] = [];
      const rawValues: string[] = [];

      for (const cell of columnData) {
        const value = extractNumericValue(cell);
        if (value !== null) {
          values.push(value);
          rawValues.push(cell);
        }
      }

      if (values.length > 0) {
        bestColumn = {
          columnIndex: colIndex,
          columnName: table.headers[colIndex] || `Column ${colIndex}`,
          values,
          rawValues,
        };
        bestRatio = ratio;
      }
    }
  }

  if (bestColumn) {
    console.log(
      `✓ Selected column: "${bestColumn.columnName}" with ${bestColumn.values.length} numeric values`
    );
  } else {
    console.log("✗ No numeric column found");
  }

  return bestColumn;
}

/**
 * Main function to extract numeric data from Wikipedia HTML
 */
export function parseWikipediaTable(html: string): NumericColumn | null {
  const tables = extractTables(html);

  if (tables.length === 0) {
    throw new Error("No tables found on this Wikipedia page");
  }

  // Try each table until we find one with numeric data
  for (const table of tables) {
    const numericColumn = findNumericColumn(table);
    if (numericColumn) {
      return numericColumn;
    }
  }

  throw new Error("No numeric columns found in any table");
}

/**
 * Helper functions
 */
/**
 * Checks if a cell contains a link (marked during parsing)
 */
function hasLink(text: string): boolean {
  return text.startsWith("[LINK]");
}

/**
 * Checks if a string appears to be a date
 */
function looksLikeDate(text: string): boolean {
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
function looksMeasurement(text: string): boolean {
  const units =
    /\b(m|meter|metre|cm|km|ft|foot|feet|inch|in|mile|yard|yd|kg|lb|pound|sec|min|hour)\b/i;
  return units.test(text);
}
