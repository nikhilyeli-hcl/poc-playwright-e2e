import { test, expect } from '@playwright/test';

test.describe('Todo App - overall e2e flow', () => {
  test('should complete a full user journey across add, complete, filter, and clear', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
    await expect(page.getByTestId('remaining-count')).toContainText('2 items left');

    await page.getByTestId('todo-input').fill('Run complete app e2e flow');
    await page.getByTestId('add-todo-btn').click();
    await expect(page.locator('.todo-text', { hasText: 'Run complete app e2e flow' })).toBeVisible();
    await expect(page.getByTestId('remaining-count')).toContainText('3 items left');

    const createdItem = page.locator('.todo-item', { has: page.locator('.todo-text', { hasText: 'Run complete app e2e flow' }) });
    await createdItem.getByRole('checkbox').check();
    await expect(createdItem).toHaveClass(/completed/);
    await expect(page.getByTestId('remaining-count')).toContainText('2 items left');

    await page.getByTestId('filter-completed').click();
    await expect(page.locator('.todo-text', { hasText: 'Run complete app e2e flow' })).toBeVisible();

    await page.getByTestId('clear-completed').click();
    await expect(page.locator('.todo-text', { hasText: 'Run complete app e2e flow' })).toHaveCount(0);
  });
});
