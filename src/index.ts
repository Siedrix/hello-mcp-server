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

// Convert task to MCP tool
// const convertTaskToTool = (descriptor: any, name: string) => {
//   const task = descriptor.task;
//   const schema = task.getSchema() ?? new Schema({});
  
//   // Convert Schema schema to Zod schema for MCP
//   // This is a simplified approach - might need refinement based on schema complexity
//   const zodSchema: Record<string, any> = {};
//   const schemaObj = schema.describe();
  
//   interface SchemaProperty {
//     type: string;
//     description?: string;
//     optional?: boolean;
//     [key: string]: any;
//   }
  
//   if (schemaObj.properties) {
//     for (const [key, prop] of Object.entries(schemaObj.properties as Record<string, SchemaProperty>)) {
//       if (prop.type === 'string') {
//         zodSchema[key] = z.string();
//         if (prop.description) {
//           zodSchema[key] = zodSchema[key].describe(prop.description);
//         }
//       } else if (prop.type === 'number') {
//         zodSchema[key] = z.number();
//         if (prop.description) {
//           zodSchema[key] = zodSchema[key].describe(prop.description);
//         }
//       } else if (prop.type === 'boolean') {
//         zodSchema[key] = z.boolean();
//         if (prop.description) {
//           zodSchema[key] = zodSchema[key].describe(prop.description);
//         }
//       }
//       // Add more types as needed
      
//       if (prop.optional) {
//         zodSchema[key] = zodSchema[key].optional();
//       }
//     }
//   }
  
//   // Register the task as an MCP tool
//   server.tool(
//     name,
//     task.getDescription() ?? `Execute the ${name} task`,
//     zodSchema,
//     async (input) => {
//       console.error('==============================================');
//       console.error(`Invoking task: ${name} with input:`, input);
//       console.error('==============================================');
      
//       try {
//         const result = await task.run(input);
//         console.error('==============================================');
//         console.error('Result:', result);
//         console.error('==============================================');
        
//         // Format the result as text for MCP response
//         let resultText = '';
//         if (typeof result === 'string') {
//           resultText = result;
//         } else if (result && typeof result === 'object') {
//           if (name === 'get_stock_price') {
//             // Special handling for stock price results
//             resultText = `The current price of ${result.ticker} is ${result.price} ${result.currency} on ${result.exchange} as of ${result.timestamp}`;
//           } else {
//             resultText = JSON.stringify(result, null, 2);
//           }
//         } else {
//           resultText = String(result);
//         }
        
//         return {
//           content: [{
//             type: "text",
//             text: resultText
//           }]
//         };
//       } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : String(error);
//         console.error('==============================================');
//         console.error('Error:', errorMessage);
//         console.error('==============================================');
        
//         return {
//           content: [{
//             type: "text",
//             text: `Error executing task ${name}: ${errorMessage}`
//           }]
//         };
//       }
//     }
//   );
// };

const convertTaskToTool = (descriptor: any) => {
  const task = descriptor.task;
  const schema = task.getSchema() ?? new Schema({});

  const fn = async (input: any) => {
    const result = await task.run(input);
  
    return result;
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