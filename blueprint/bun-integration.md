# Bun.js Integration Guide

This document provides a guide to integrating Bun.js into the SocialCraft project, based on the official documentation.

## Getting Started

### Initializing a Project

The `bun init` command is used to scaffold a new Bun project. It's an interactive tool that sets up the basic file structure.

```sh
bun init
```

This will create the following files:

-   `package.json`
-   `index.ts` (or your chosen entry point)
-   `.gitignore`
-   `tsconfig.json`
-   `README.md`

### Creating a Simple HTTP Server

Bun has a built-in, high-performance HTTP server.

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
```

To run the server, execute the entry file with `bun`:

```sh
bun run index.ts
```

### Using `package.json` Scripts

You can define scripts in your `package.json` to streamline common tasks.

```json
{
  "name": "quickstart",
  "module": "index.ts",
  "type": "module",
  "scripts": {
    "start": "bun run index.ts"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

Then, you can run the `start` script with:

```sh
bun run start
```

### Installing Dependencies

Bun has a built-in package manager that is significantly faster than npm, yarn, or pnpm.

To add a package:

```sh
bun add figlet
```

To add a development dependency:

```sh
bun add -d @types/figlet
```

### Full-Stack Applications

Bun can serve HTML files and automatically bundle any referenced scripts or stylesheets.

```typescript
import dashboard from "./dashboard.html";
import homepage from "./index.html";

const server = serve({
  routes: {
    "/": homepage,
    "/dashboard": dashboard,
  },
  development: true,
});
```

## SvelteKit Integration

While the documentation doesn't explicitly detail SvelteKit integration in the "getting-started" section, the `bun create` command can be used with Svelte templates. The blueprint mentions using `bun create svelte@latest SocialCraft`. This leverages Bun's speed to scaffold a new SvelteKit project.

The blueprint also notes potential maturity issues with Bun's SvelteKit adapter and suggests that for production, the standard Node.js adapter might be a more stable choice initially. This is a key consideration for the deployment strategy.

## Key Takeaways for SocialCraft

*   Bun's built-in tools (`init`, `run`, `add`, `serve`) will be used to streamline development.
*   The project will be initialized using `bun create svelte@latest SocialCraft`.
*   Server-side logic, especially for API routes and server actions in SvelteKit, will run on the Bun runtime.
*   The deployment strategy will need to carefully consider the choice between Bun's native SvelteKit adapter and the more mature Node.js adapter, especially for the initial production launch.

This information will be used to expand the `02-tech-stack-and-setup.md` file with more detailed, actionable steps for setting up the backend environment.