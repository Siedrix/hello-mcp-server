# Hello MCP Server

This is a Model Context Protocol (MCP) server implementation that enables AI assistants to interact with external services and data sources. The server is designed to work with Claude and other MCP-compatible AI assistants.

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hello-mcp-server
pnpm install
```

## Build

Build the project with:

```bash
pnpm run build
```

This will compile TypeScript into JavaScript in the `dist` directory.

## Running Tasks Directly

You can run individual tasks directly using the Forge runner:

```bash
# Run the stock price task with a ticker parameter
npx @forgehive/runner task:run stock:price --ticker AAPL
```

## Adding to Claude Desktop

To use the server with Claude Desktop:

1. Build the project with `pnpm run build`
2. Modify the Claude Desktop configuration file:

```bash
# Location: ~/Library/Application Support/Claude/claude_desktop_config.json
{
    "mcpServers": {
        "hello-mcp-server": {
            "command": "node",
            "args": [
                "ABSOLUTE_PATH_TO_PROJECT/hello-mcp-server/dist/index.js"
            ]
        }
    }
}
```

Replace `ABSOLUTE_PATH_TO_PROJECT` with the actual absolute path to your project directory.

## Using MCP Inspector

For debugging and testing your MCP server, you can use the MCP Inspector tool:

```bash
npx @modelcontextprotocol/inspector ABSOLUTE_PATH_TO_PROJECT/hello-mcp-server/dist/index.js
```

The inspector provides a web interface to test your server's tools and see their responses.

## Development

To add new tasks:

1. Create a new task using the Forge CLI:
   ```bash
   forge task:create MODULE:TASK_NAME
   ```
   This will generate a task template file in `src/tasks/MODULE/TASK_NAME.ts`.

2. Implement your task in the generated file using the Forge Task API.

3. Register the task in the runner (src/runner.ts):
   ```typescript
   import { yourTask } from './tasks/module/your-task';
   
   // Add your task to the runner
   runner.load('your_task_name', yourTask);
   ```

4. Build the project with `pnpm run build`

The server will automatically register all tasks from the runner as MCP tools without needing to manually add them to the `src/index.ts` file.

## Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [MCP Quickstart Guide](https://modelcontextprotocol.io/quickstart/server)



