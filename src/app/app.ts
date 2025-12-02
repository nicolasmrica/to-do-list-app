import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoService } from './services/todo.service';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddTodoComponent, TodoListComponent],
  template: `
    <main class="app-container">
      <header class="app-header">
        <h1>Todo List</h1>
        <p class="todo-stats" aria-live="polite">
          {{ todoService.pendingCount() }} pending, {{ todoService.completedCount() }} completed
        </p>
      </header>

      <app-add-todo (addTodo)="onAddTodo($event)" />

      <app-todo-list
        [todos]="todoService.todos()"
        (toggle)="onToggle($event)"
        (delete)="onDelete($event)"
      />

      @if (todoService.completedCount() > 0) {
        <footer class="app-footer">
          <button
            type="button"
            class="clear-button"
            (click)="onClearCompleted()"
            aria-label="Clear all completed todos"
          >
            Clear completed ({{ todoService.completedCount() }})
          </button>
        </footer>
      }
    </main>
  `,
  styles: `
    .app-container {
      max-width: 600px;
      margin: 2rem auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .app-header {
      padding: 1.5rem;
      background-color: #0056b3;
      color: white;
      text-align: center;
    }

    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .todo-stats {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .app-footer {
      padding: 1rem;
      background-color: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      text-align: center;
    }

    .clear-button {
      padding: 0.5rem 1rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .clear-button:hover {
      background-color: #5a6268;
    }

    .clear-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }
  `,
})
export class App {
  readonly todoService = inject(TodoService);

  onAddTodo(title: string): void {
    this.todoService.addTodo(title);
  }

  onToggle(id: string): void {
    this.todoService.toggleComplete(id);
  }

  onDelete(id: string): void {
    this.todoService.removeTodo(id);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }
}