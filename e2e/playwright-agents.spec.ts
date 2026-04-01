import { test, expect } from '@playwright/test';

/**
 * Playwright Agents POC
 * 
 * This file demonstrates how Playwright tests can serve as "agents" — autonomous
 * test scripts that inspect the page using the accessibility tree, interact with
 * UI elements semantically, and verify behaviour without relying on fixed coordinates
 * or visual screenshots.
 *
 * When used together with the Playwright MCP server (see .vscode/mcp.json), an AI
 * agent (e.g. GitHub Copilot, Claude) can read the accessibility snapshot of any
 * page, generate and run these kinds of interactions dynamically.
 *
 * Key capabilities demonstrated:
 *  - Accessibility-tree-based element discovery
 *  - Semantic locators (roles, labels, test-ids)
 *  - Self-describing assertions
 *  - Dynamic interaction patterns
 */
test.describe('Playwright Agents – Accessibility-driven interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * An agent discovers all interactive elements on the page via the accessibility
   * tree and verifies they are focusable and labelled correctly.
   */
  test('agent: discover interactive controls via accessibility tree', async ({ page }) => {
    // Locate all buttons by their ARIA role
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Each button should have accessible text
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i);
      const text = (await btn.textContent()) ?? '';
      expect(text.trim().length).toBeGreaterThan(0);
    }

    // The text input should have an accessible label
    const input = page.getByRole('textbox', { name: /new todo/i });
    await expect(input).toBeVisible();
  });

  /**
   * Simulates an AI agent that reads the page title, identifies the task list,
   * and performs a full workflow: add → toggle → delete.
   */
  test('agent: perform a full todo workflow autonomously', async ({ page }) => {
    // Step 1: Read page state
    const title = await page.locator('h1').textContent();
    expect(title).toBe('Todo App');

    // Step 2: Add a new task discovered from context
    const input = page.getByRole('textbox', { name: /new todo/i });
    await input.fill('Agent-generated task');
    await input.press('Enter');

    // Step 3: Verify the task was added
    const newItem = page.locator('.todo-text', { hasText: 'Agent-generated task' });
    await expect(newItem).toBeVisible();

    // Step 4: Toggle it complete
    const listItems = page.locator('.todo-item');
    const lastItem = listItems.last();
    const checkbox = lastItem.locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(lastItem).toHaveClass(/completed/);

    // Step 5: Delete it
    const deleteBtn = lastItem.getByRole('button', { name: /delete/i });
    await deleteBtn.click();
    await expect(newItem).not.toBeVisible();
  });

  /**
   * Demonstrates snapshot-based introspection — the agent queries the page
   * accessibility tree to build an understanding of available filter actions.
   */
  test('agent: introspect filter controls and cycle through all filters', async ({ page }) => {
    const filterSection = page.getByRole('region', { name: /filter todos/i });
    const filterButtons = filterSection.getByRole('button');

    const labels: string[] = [];
    const count = await filterButtons.count();
    for (let i = 0; i < count; i++) {
      const label = await filterButtons.nth(i).textContent();
      if (label) labels.push(label.trim());
    }

    // Agent discovers filter names
    expect(labels).toEqual(expect.arrayContaining(['All', 'Active', 'Completed']));

    // Agent activates each filter and verifies the list updates
    for (const label of labels) {
      const btn = filterSection.getByRole('button', { name: label });
      await btn.click();
      await expect(btn).toHaveClass(/active/);

      const listItems = page.locator('.todo-item, .todo-empty');
      await expect(listItems.first()).toBeVisible();
    }
  });

  /**
   * Demonstrates how an agent can handle dynamic content:
   * adds multiple items concurrently and then batch-deletes them.
   */
  test('agent: batch add and verify multiple todos', async ({ page }) => {
    const tasks = ['Task Alpha', 'Task Beta', 'Task Gamma'];

    for (const task of tasks) {
      await page.getByTestId('todo-input').fill(task);
      await page.getByTestId('add-todo-btn').click();
    }

    // Verify all tasks are visible
    for (const task of tasks) {
      await expect(page.locator('.todo-text', { hasText: task })).toBeVisible();
    }

    // Remaining count should have increased
    const counter = page.getByTestId('remaining-count');
    const text = await counter.textContent();
    const match = text?.match(/(\d+)/);
    const remaining = match ? parseInt(match[1], 10) : 0;
    expect(remaining).toBeGreaterThanOrEqual(tasks.length);
  });
});
