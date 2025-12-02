import { computed, Injectable, signal } from '@angular/core';
import { TodoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todosSignal = signal<TodoItem[]>([]);

  // Public readonly access to todos
  readonly todos = this.todosSignal.asReadonly();

  // Derived state using computed signals
  readonly completedTodos = computed(() => this.todosSignal().filter((todo) => todo.completed));

  readonly pendingTodos = computed(() => this.todosSignal().filter((todo) => !todo.completed));

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

    this.todosSignal.update((todos) => [...todos, newTodo]);
  }

  removeTodo(id: string): void {
    this.todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  toggleComplete(id: string): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }

  updateTodo(id: string, title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    this.todosSignal.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, title: trimmedTitle } : todo))
    );
  }

  clearCompleted(): void {
    this.todosSignal.update((todos) => todos.filter((todo) => !todo.completed));
  }
}