import { computed, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TodoItem } from '../models/todo-item.model';

const STORAGE_KEY = "todos";

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private readonly platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // LocalStorage methods
  private saveToStorage(todos: TodoItem[]): void {

    if (!this.isBrowser()) {
      return;
    }

    try {
      const serialized = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  private loadFromStorage(): TodoItem[] {

    if (!this.isBrowser()) {
      return [];
    }

    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return [];
      }

      const parsed = JSON.parse(serialized);

      // Convert date strings back to Date objects
      return parsed.map((todo: TodoItem) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  }

  // Signal initialized with loaded data
  private readonly todosSignal = signal<TodoItem[]>(this.loadFromStorage());

  // Public readonly access to todos
  readonly todos = this.todosSignal.asReadonly();

  // Derived state using computed signals
  readonly completedTodos = computed(() =>
    this.todosSignal().filter((todo) => todo.completed)
  );

  readonly pendingTodos = computed(() =>
    this.todosSignal().filter((todo) => !todo.completed)
  );

  readonly completedCount = computed(() => this.completedTodos().length);

  readonly pendingCount = computed(() => this.pendingTodos().length);

  readonly totalCount = computed(() => this.todosSignal().length);

  // CRUD Operations
  addTodo(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date(),
    };

    this.todosSignal.update((todos) => {
      const updatedTodos = [...todos, newTodo];
      this.saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }


  removeTodo(id: string): void {
    this.todosSignal.update((todos) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      this.saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  toggleComplete(id: string): void {
    this.todosSignal.update((todos) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      this.saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  updateTodo(id: string, title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    this.todosSignal.update((todos) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, title: trimmedTitle } : todo
      );
      this.saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  clearCompleted(): void {
    this.todosSignal.update((todos) => {
      const updatedTodos = todos.filter((todo) => !todo.completed);
      this.saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }
}