import { Component } from '@angular/core';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: false,
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo {
  newTodoText = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  items: TodoItem[] = [
    { id: 1, text: 'Learn Playwright MCP', completed: false },
    { id: 2, text: 'Set up Angular project', completed: true },
    { id: 3, text: 'Write E2E tests', completed: false },
  ];
  private nextId = 4;

  get filteredItems(): TodoItem[] {
    if (this.filter === 'active') {
      return this.items.filter((item) => !item.completed);
    }
    if (this.filter === 'completed') {
      return this.items.filter((item) => item.completed);
    }
    return this.items;
  }

  get remainingCount(): number {
    return this.items.filter((item) => !item.completed).length;
  }

  addTodo(): void {
    const text = this.newTodoText.trim();
    if (!text) return;
    this.items.push({ id: this.nextId++, text, completed: false });
    this.newTodoText = '';
  }

  toggleTodo(item: TodoItem): void {
    item.completed = !item.completed;
  }

  deleteTodo(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clearCompleted(): void {
    this.items = this.items.filter((item) => !item.completed);
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.filter = filter;
  }
}
