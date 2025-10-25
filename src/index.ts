import { fetchPage } from "./fetcher.js";

async function main(): Promise<void> {
  console.log("Wiki Table Plotter Starting...\n");

  // @TODO: Replace with dynamic input or config
  const url =
    "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression";

  try {
    const html = await fetchPage(url);
    console.log(`\n Successfully fetched page (${html.length} characters)`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n Error: ${error.message}`);
    }
  }
}

main();
