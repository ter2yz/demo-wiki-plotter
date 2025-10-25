import type { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

import type { NumericColumn } from "./types.js";

/**
 * Configuration for chart generation
 */
interface PlotterConfig {
  width: number;
  height: number;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: PlotterConfig = {
  width: 800,
  height: 600,
  title: "Wikipedia Table Data",
  xAxisLabel: "Index",
  yAxisLabel: "Value",
};

/**
 * Generates a chart from numeric data
 * @param data - The numeric column data to plot
 * @param config - Optional chart configuration
 * @returns Buffer containing the PNG image
 */
export async function generateChart(
  data: NumericColumn,
  config: Partial<PlotterConfig> = {}
): Promise<Buffer> {
  console.log("📊 Generating chart...");

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Create chart renderer
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: finalConfig.width,
    height: finalConfig.height,
  });

  // Prepare data for Chart.js
  const labels = data.values.map((_, index) => (index + 1).toString());

  const chartConfig: ChartConfiguration = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: data.columnName,
          data: data.values,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: finalConfig.title,
          font: {
            size: 16,
          },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: finalConfig.xAxisLabel,
          },
        },
        y: {
          title: {
            display: true,
            text: finalConfig.yAxisLabel || data.columnName,
          },
          beginAtZero: false,
        },
      },
    },
  };

  // Render chart to buffer
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);

  console.log("✓ Chart generated successfully");
  return imageBuffer;
}

/**
 * Saves a chart buffer to a file
 * @param buffer - The image buffer to save
 * @param filename - The output filename
 */
export async function saveChart(
  buffer: Buffer,
  filename: string
): Promise<void> {
  const fs = await import("fs");

  // Create output directory if it doesn't exist
  const outputDir = "output";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created ${outputDir}/ directory`);
  }

  // Write the file
  fs.writeFileSync(`${outputDir}/${filename}`, buffer);
  console.log(`✓ Chart saved to: ./${outputDir}/${filename}`);
}
