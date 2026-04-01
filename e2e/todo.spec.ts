import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Angular Todo application.
 * 
 * These tests demonstrate Playwright's capabilities for testing Angular applications,
 * using semantic locators (data-testid attributes) for robust element selection.
 */
test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Todo App');
  });

  test('should show default todo items on load', async ({ page }) => {
    const todoList = page.getByTestId('todo-list');
    await expect(todoList).toBeVisible();
    // Default items pre-seeded in the component
    await expect(todoList.locator('.todo-item')).toHaveCount(3);
  });

  test('should add a new todo item', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    const addBtn = page.getByTestId('add-todo-btn');

    await input.fill('Write Playwright MCP tests');
    await addBtn.click();

    await expect(page.getByTestId('todo-list').locator('.todo-item')).toHaveCount(4);
    await expect(page.locator('.todo-text').last()).toHaveText('Write Playwright MCP tests');
  });

  test('should add a new todo item by pressing Enter', async ({ page }) => {
    const input = page.getByTestId('todo-input');

    await input.fill('Another task via Enter');
    await input.press('Enter');

    await expect(page.locator('.todo-text').last()).toHaveText('Another task via Enter');
  });

  test('should not add empty todo', async ({ page }) => {
    const addBtn = page.getByTestId('add-todo-btn');
    const listBefore = page.getByTestId('todo-list').locator('.todo-item');
    const countBefore = await listBefore.count();

    await addBtn.click();

    await expect(page.getByTestId('todo-list').locator('.todo-item')).toHaveCount(countBefore);
  });

  test('should toggle a todo as completed', async ({ page }) => {
    // First item (id=1) should be incomplete by default
    const checkbox = page.getByTestId('todo-checkbox-1');
    await checkbox.check();

    const item = page.getByTestId('todo-item-1');
    await expect(item).toHaveClass(/completed/);
  });

  test('should delete a todo item', async ({ page }) => {
    const countBefore = await page.getByTestId('todo-list').locator('.todo-item').count();
    await page.getByTestId('todo-delete-1').click();
    await expect(page.getByTestId('todo-list').locator('.todo-item')).toHaveCount(countBefore - 1);
  });

  test('should filter active todos', async ({ page }) => {
    await page.getByTestId('filter-active').click();
    // Only non-completed items should show (items 1 and 3 are active by default)
    const items = page.getByTestId('todo-list').locator('.todo-item');
    // Wait until at least one item is visible and none are completed
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    // All visible items should be active (not completed)
    await expect(items.filter({ has: page.locator('.completed') })).toHaveCount(0);
  });

  test('should filter completed todos', async ({ page }) => {
    await page.getByTestId('filter-completed').click();
    // Only completed items should show (item 2 by default)
    const items = page.getByTestId('todo-list').locator('.todo-item');
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    // All visible items should have the 'completed' class
    await expect(page.getByTestId('todo-list').locator('.todo-item:not(.completed)')).toHaveCount(0);
  });

  test('should clear all completed todos', async ({ page }) => {
    const clearBtn = page.getByTestId('clear-completed');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    // No completed items should remain
    await page.getByTestId('filter-completed').click();
    await expect(page.locator('.todo-empty')).toBeVisible();
  });

  test('should show remaining item count', async ({ page }) => {
    const counter = page.getByTestId('remaining-count');
    // 2 of 3 default items are active
    await expect(counter).toContainText('2 items left');
  });

  test('should update remaining count after adding and completing items', async ({ page }) => {
    // Add one new item
    await page.getByTestId('todo-input').fill('New task');
    await page.getByTestId('add-todo-btn').click();

    // Now complete it
    const items = page.getByTestId('todo-list').locator('.todo-item');
    const lastItem = items.last();
    const id = (await lastItem.getAttribute('data-testid'))?.replace('todo-item-', '');
    await page.getByTestId(`todo-checkbox-${id}`).check();

    // Count should remain at 2 (we added 1 and completed 1)
    await expect(page.getByTestId('remaining-count')).toContainText('2 items left');
  });
});
