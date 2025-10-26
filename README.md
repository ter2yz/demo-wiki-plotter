# Wikipedia Table Graph Generator

A TypeScript CLI tool that extracts numeric data from Wikipedia tables and generates line chart visualizations. Built as part of the Detector Inspector engineering assessment.

## Overview

This program:
1. Fetches a Wikipedia page
2. Identifies tables with numeric data
3. Extracts the most relevant numeric column
4. Generates a line chart visualization
5. Saves the chart as a PNG image

## Tech Stack

- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment
- **Cheerio** - HTML parsing and table extraction
- **Chart.js** (chartjs-node-canvas) - Chart generation
- **Axios** - HTTP requests
- **Jest** - Testing framework

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup
```bash
# Clone or download the repository
cd demo-wiki-plotter

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Interactive Mode

Run without arguments to be prompted for a URL:
```bash
npm run dev
```

Then enter a Wikipedia URL when prompted:
```
Please enter Wikipedia URL: https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression
```

### Direct Mode

Pass the URL as a command-line argument:
```bash
npm run dev "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression"
```

### Using the Compiled Version

After building with `npm run build`:
```bash
npm start "https://en.wikipedia.org/wiki/Los_Angeles_Lakers"
```

### Example URLs to Try
```bash
# Sports records
npm run dev "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression"

# Team statistics
npm run dev "https://en.wikipedia.org/wiki/Los_Angeles_Lakers"

# Olympic data
npm run dev "https://en.wikipedia.org/wiki/2024_Summer_Olympics"
```

## Output

Generated charts are saved in the `output/` directory with dynamic filenames:

- Input: `https://en.wikipedia.org/wiki/Los_Angeles_Lakers`
- Output: `output/los_angeles_lakers-output.png`

The program automatically creates the output directory if it doesn't exist.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Design Decisions

### Architecture

The application follows a modular architecture with clear separation of concerns:

- **Fetcher** - Handles HTTP requests and network errors
- **Parser** - HTML parsing, table extraction, and numeric data identification
- **Plotter** - Chart configuration and image generation
- **Helpers** - Reusable utility functions
- **Index** - Orchestrates the workflow and handles user interaction

### Numeric Column Identification

The parser uses a multi-priority system to identify numeric data:

1. **Priority 1**: Measurements with units (e.g., "1.46 m", "5 ft 2 in")
2. **Priority 2**: Decimal numbers (e.g., "1.524")
3. **Priority 3**: Integers (with cautious filtering)

A column is considered "numeric" if at least 70% of its cells contain extractable numbers.

### Filtering Strategy

The parser automatically filters out:
- **Dates** - Using pattern matching for month names and date formats
- **Links** - Detected at HTML parsing stage via `<a>` tags
- **References** - Text containing brackets `[1]`, `[citation needed]`
- **Years** - 4-digit numbers in the range 1800-2100 without context

This approach prioritizes measurement data (the most common numeric content in Wikipedia tables) while avoiding false positives from dates and references.

### Chart Configuration

Charts are generated with:
- Line graph format for showing progression/trends
- Automatic axis labeling based on column names
- Sequential x-axis (record number/index)
- Responsive sizing (800x600 default)
