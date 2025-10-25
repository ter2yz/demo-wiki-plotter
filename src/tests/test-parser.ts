import { fetchPage } from "../fetcher.js";
import { extractNumericValue, parseWikipediaTable } from "../parser.js";

async function testExtraction(): Promise<void> {
  console.log("Testing extractNumericValue function:\n");

  const testCases = [
    "1.46 m (4 ft 9¼ in)", // Should extract: 1.46
    "20 May 1922", // Should extract: null (date)
    "Nancy Voorhees", // Should extract: null
    "1.524", // Should extract: 1.524
    "London[1]", // Should extract: null (reference)
    "5 ft 2 in", // Should extract: 5
    "August 1928", // Should extract: null (date)
    "1.62 m (5 ft 3¾ in)", // Should extract: 1.62
    "[LINK]2014", // Should extract: null (has link) ← NEW!
    "[LINK]2014 NBA draft", // Should extract: null (has link) ← NEW!
  ];

  for (const test of testCases) {
    const result = extractNumericValue(test);
    console.log(`  "${test}" -> ${result}`);
  }

  console.log("\n");
}

async function testFullParser(): Promise<void> {
  try {
    console.log("=================================");
    console.log("Testing Parser");
    console.log("=================================\n");

    const url =
      //   "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression";
      "https://en.wikipedia.org/wiki/Los_Angeles_Lakers";

    // Fetch
    const html = await fetchPage(url);

    // Parse
    const numericData = parseWikipediaTable(html);

    if (numericData) {
      console.log("\n📊 Results:");
      console.log(`   Column: ${numericData.columnName}`);
      console.log(`   Data points: ${numericData.values.length}`);
      console.log(
        `   First 5 values: ${numericData.values.slice(0, 5).join(", ")}`
      );
      console.log(
        `   Raw format examples: ${numericData.rawValues.slice(0, 3).join(" | ")}`
      );
    }

    console.log("\n✅ Parser test passed!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("\n❌ Test failed:", error.message);
    }
  }
}

async function main(): Promise<void> {
  await testExtraction();
  await testFullParser();
}

main();
