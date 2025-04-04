#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { price } from "./tasks/stock/price.js";

// const NWS_API_BASE = "https://api.weather.gov";
// const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "hello-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    return {
      content: [{
        type: "text",
        text: `Hello, ${state}!`,
      }],
    };
  }
);

server.tool(
  "get-stock-price",
  "Get the current stock price for a given ticker symbol",
  {
    ticker: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOG)"),
  },
  async ({ ticker }) => {
    try {
      const result = await price.run({ ticker });
      
      return {
        content: [{
          type: "text",
          text: `The current price of ${result.ticker} is ${result.price} ${result.currency} on ${result.exchange} as of ${result.timestamp}`,
        }],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: "text",
          text: `Error fetching stock price for ${ticker}: ${errorMessage}`,
        }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Hello MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});