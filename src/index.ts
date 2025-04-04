#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { type Runner } from '@forgehive/runner';
import { Schema } from "@forgehive/schema";
import runner from "./runner";

// Create server instance
const server = new McpServer({
  name: "hello-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const convertTaskToTool = (descriptor: any) => {
  const task = descriptor.task;
  const schema = task.getSchema() ?? new Schema({});

  const fn = async (args: any, extra: any) => {
    const result = await task.run(args);
  
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  return fn;
};

// Register all tasks from the runner
const registerTasksAsTools = (runner: Runner) => {
  const tasks = runner.getTasks();
  
  for (const [name, descriptor] of Object.entries(tasks)) {
    const task = descriptor.task;
    const schema = task.getSchema() ?? new Schema({});
    const description = task.getDescription() ?? `Execute the ${name} task`;
    const zodSchema = schema.asZod();

    const toolFn = convertTaskToTool(descriptor);

    server.tool(name, description, zodSchema.shape, toolFn);
  }
};

// Register tasks as tools
registerTasksAsTools(runner);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.exit(1);
});