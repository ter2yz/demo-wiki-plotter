import { createInterface } from "readline";

import { fetchPage } from "./fetcher.js";
import { parseWikipediaTable } from "./parser.js";
import { generateChart, saveChart } from "./plotter.js";
import { generateFilename } from "./utils/helpers.js";

/**
 * Process a Wikipedia URL and generate a graph
 */
async function processWikipediaPage(url: string): Promise<string> {
  // Step 1: Fetch the page
  const html = await fetchPage(url);

  // Step 2: Parse and find numeric data
  const numericData = parseWikipediaTable(html);

  if (!numericData) {
    throw new Error("No numeric data found in any table on this page");
  }

  // Step 3: Generate chart
  const chartBuffer = await generateChart(numericData, {
    title: `${numericData.columnName} - Wikipedia Data`,
    xAxisLabel: "Record Number",
    yAxisLabel: numericData.columnName,
  });

  // Step 4: Generate dynamic filename from URL
  const filename = generateFilename(url);

  // Step 5: Save chart to file
  await saveChart(chartBuffer, filename);

  return filename;
}

/**
 * Main entry point - supports both interactive and direct modes
 */
async function main(): Promise<void> {
  console.log("=================================");
  console.log("Wikipedia Table Graph Generator");
  console.log("=================================\n");

  const urlArg = process.argv[2];

  if (urlArg) {
    // Direct mode: node index.js "https://..."
    try {
      console.log(`Processing: ${urlArg}\n`);
      const filename = await processWikipediaPage(urlArg);
      console.log(`\n✅ Success! Graph saved to: ${filename}`);
      console.log(`   Open it with: open ${filename}\n`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`\n❌ Error: ${error.message}\n`);
        process.exit(1);
      }
    }
  } else {
    // Interactive mode: node index.js
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Please enter Wikipedia URL: ", async (url) => {
      console.log("");

      try {
        const filename = await processWikipediaPage(url);
        console.log(`\n✅ Success! Graph saved to: ${filename}`);
        console.log(`   Open it with: open ${filename}\n`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`\n❌ Error: ${error.message}\n`);
        }
      }

      rl.close();
    });
  }
}

main();
