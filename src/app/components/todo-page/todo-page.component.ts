import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddTodoComponent, TodoListComponent],
  template: `
    <main class="app-container" data-testid="container-app">
      <header class="app-header" data-testid="header-app">
        <div class="header-top">
          <h1 data-testid="text-appTitle">Todo List</h1>
          <button
            type="button"
            class="logout-button"
            data-testid="button-logout"
            (click)="onLogout()"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
        <p class="todo-stats" aria-live="polite" data-testid="text-todoStats">
          {{ todoService.pendingCount() }} pending, {{ todoService.completedCount() }} completed
        </p>
      </header>

      <app-add-todo (addTodo)="onAddTodo($event)" />

      <app-todo-list
        [todos]="todoService.todos()"
        (toggle)="onToggle($event)"
        (delete)="onDelete($event)"
        (edit)="onEdit($event)"
      />

      @if (todoService.completedCount() > 0) {
        <footer class="app-footer" data-testid="footer-app">
          <button
            type="button"
            class="clear-button"
            data-testid="button-clearCompleted"
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

    .header-top {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .logout-button {
      position: absolute;
      right: 0;
      padding: 0.375rem 0.75rem;
      background-color: transparent;
      color: white;
      border: 1px solid white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-button:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
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
export class TodoPageComponent {
  readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onAddTodo(title: string): void {
    this.todoService.addTodo(title);
  }

  onToggle(id: string): void {
    this.todoService.toggleComplete(id);
  }

  onDelete(id: string): void {
    this.todoService.removeTodo(id);
  }

  onEdit(event: { id: string; title: string }): void {
    this.todoService.updateTodo(event.id, event.title);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}