# poc-playwright-e2e

A **Proof of Concept** demonstrating [Playwright MCP](https://playwright.dev/docs/getting-started-mcp) and **Playwright Agents** integrated with an Angular application.

![Todo App Screenshot](https://github.com/user-attachments/assets/4bbd02e5-018f-4d79-b477-9883f3eb636a)

---

## Overview

This POC demonstrates:

| Capability | Description |
|---|---|
| **Angular App** | A feature-complete Todo application built with Angular 21 |
| **Playwright E2E Tests** | End-to-end tests using semantic locators (`data-testid`, ARIA roles) |
| **Playwright MCP** | Model Context Protocol server enabling AI agents to browse and test via the accessibility tree |
| **Angular CLI MCP** | MCP server providing Angular-aware tooling to AI agents |
| **Playwright Agents** | Agent-style test patterns: accessibility-driven, self-describing, autonomous workflows |

---

## Repository Structure

```
poc-playwright-e2e/
├── angular-app/                   # Angular 21 Todo application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts             # Root component (router outlet)
│   │   │   ├── app-module.ts      # App module (BrowserModule + FormsModule)
│   │   │   ├── app-routing-module.ts
│   │   │   └── components/
│   │   │       └── todo/          # Feature: Todo list
│   │   │           ├── todo.ts    # Component logic
│   │   │           ├── todo.html  # Template with data-testid attributes
│   │   │           └── todo.scss  # Scoped styles
│   │   ├── index.html
│   │   └── styles.scss
│   └── package.json
│
├── e2e/                           # Playwright E2E tests
│   ├── todo.spec.ts               # Functional tests for the Todo app
│   └── playwright-agents.spec.ts  # Agent-style accessibility-driven tests
│
├── .vscode/
│   ├── mcp.json                   # MCP server configuration (Playwright + Angular CLI)
│   └── extensions.json            # Recommended VS Code extensions
│
├── playwright.config.ts           # Playwright configuration (auto-starts Angular dev server)
└── package.json                   # Root scripts
```

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+

---

## Getting Started

### 1. Install dependencies

```bash
# Root (Playwright)
npm install

# Angular application
cd angular-app && npm install && cd ..
```

### 2. Install Playwright browsers

```bash
npx playwright install chromium
```

### 3. Run E2E tests

The Angular dev server starts automatically:

```bash
npm run test:e2e
```

To open the interactive Playwright UI:

```bash
npm run test:e2e:ui
```

### 4. View the HTML report

```bash
npm run test:e2e:report
```

### 5. Run the Angular app locally

```bash
npm run start
# → http://localhost:4200
```

---

## Playwright MCP

[Playwright MCP](https://playwright.dev/docs/getting-started-mcp) is a **Model Context Protocol** server that lets AI agents (GitHub Copilot, Claude, Cursor, etc.) interact with a browser using the **accessibility tree** — no screenshots or visual models required.

### How it works

```
AI Agent (Copilot / Claude)
        │
        │  natural language prompt
        ▼
  Playwright MCP Server
  (reads accessibility tree)
        │
        │  structured DOM interactions
        ▼
    Chromium browser
        │
        ▼
  Angular application
```

### MCP Configuration (`.vscode/mcp.json`)

This project ships with two MCP servers pre-configured:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"],
      "cwd": "${workspaceFolder}/angular-app"
    }
  }
}
```

| Server | Purpose |
|---|---|
| `playwright` | Browser automation via accessibility tree; used for AI-driven testing and exploration |
| `angular-cli` | Exposes Angular CLI commands to AI agents (generate components, build, serve, etc.) |

### Using with GitHub Copilot (VS Code)

1. Open this repo in VS Code
2. Enable **Agent Mode** in GitHub Copilot Chat
3. The MCP servers are activated automatically from `.vscode/mcp.json`
4. Ask Copilot to navigate, interact, or test the running app:

```
@copilot Navigate to http://localhost:4200, add a new todo "Buy groceries",
mark it as complete, and tell me how many items are left.
```

### Using with Claude Desktop / Cursor

Add the following to your client's MCP settings:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

---

## Playwright Agents

The `e2e/playwright-agents.spec.ts` file demonstrates **agent-style test patterns** — tests that mimic how an AI agent would autonomously explore and interact with a UI:

| Test | What it demonstrates |
|---|---|
| Discover interactive controls | Enumerates all ARIA roles on the page; verifies labels and focusability |
| Full workflow autonomously | Read title → Add task → Toggle → Delete (no hard-coded selectors) |
| Introspect filter controls | Discovers filter buttons by role, cycles through all filters dynamically |
| Batch add and verify | Adds multiple tasks programmatically and verifies counts |

These patterns make tests **self-healing** and **robust against UI changes** — the same philosophy behind Playwright MCP.

---

## E2E Tests (`e2e/todo.spec.ts`)

| Test | Covers |
|---|---|
| Display page title | Basic page load |
| Show default items on load | Component initialization |
| Add a new todo (button click) | User input + DOM update |
| Add a new todo (Enter key) | Keyboard interaction |
| Not add empty todo | Validation |
| Toggle a todo as completed | State change + CSS class |
| Delete a todo item | Item removal |
| Filter active todos | Filter state |
| Filter completed todos | Filter state |
| Clear all completed | Batch operation |
| Show remaining item count | Derived state |
| Update count after add+complete | Complex interaction |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the Angular dev server |
| `npm run build` | Build the Angular app for production |
| `npm run test:e2e` | Run all Playwright E2E tests (headless) |
| `npm run test:e2e:ui` | Open Playwright interactive UI |
| `npm run test:e2e:report` | Open the HTML test report |
| `npm run test:unit` | Run Angular unit tests (karma) |

---

## References

- [Playwright MCP documentation](https://playwright.dev/docs/getting-started-mcp)
- [Angular CLI MCP](https://angular.dev/ai/mcp)
- [Playwright Test documentation](https://playwright.dev/docs/intro)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
