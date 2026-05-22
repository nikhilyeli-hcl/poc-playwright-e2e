import { test, expect } from '@playwright/test';

test.describe('Todo App - overall e2e flow', () => {
  test('should complete a full user journey across add, complete, filter, and clear', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
    await expect(page.getByTestId('remaining-count')).toContainText('2 items left');

    const taskName = 'Run complete app e2e flow';

    await page.getByTestId('todo-input').fill(taskName);
    await page.getByTestId('add-todo-btn').click();
    await expect(page.getByText(taskName)).toBeVisible();
    await expect(page.getByTestId('remaining-count')).toContainText('3 items left');

    const deleteButton = page.getByRole('button', { name: `Delete ${taskName}` });
    const itemId = (await deleteButton.getAttribute('data-testid'))?.replace('todo-delete-', '');
    expect(itemId).toMatch(/^\d+$/);

    const createdItem = page.getByTestId(`todo-item-${itemId}`);
    const createdItemCheckbox = createdItem.getByRole('checkbox');
    await createdItemCheckbox.check();
    await expect(createdItemCheckbox).toBeChecked();
    await expect(createdItem).toHaveClass(/completed/);
    await expect(page.getByTestId('remaining-count')).toContainText('2 items left');

    await page.getByTestId('filter-completed').click();
    await expect(page.getByText(taskName)).toBeVisible();

    await page.getByTestId('clear-completed').click();
    await expect(page.getByText(taskName)).toHaveCount(0);
  });
});
