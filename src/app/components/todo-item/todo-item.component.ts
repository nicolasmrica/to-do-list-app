import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TodoItem } from '../../models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li class="todo-item" [class.completed]="todo().completed">
      <label class="todo-label">
        <input
          type="checkbox"
          [checked]="todo().completed"
          (change)="onToggle()"
          aria-label="Mark as {{ todo().completed ? 'incomplete' : 'complete' }}"
        />
        <span class="todo-title">{{ todo().title }}</span>
      </label>
      <button
        type="button"
        class="delete-button"
        (click)="onDelete()"
        [attr.aria-label]="'Delete ' + todo().title"
      >
        Delete
      </button>
    </li>
  `,
  styles: `
    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e0e0e0;
      gap: 1rem;
    }

    .todo-item.completed .todo-title {
      text-decoration: line-through;
      color: #888;
    }

    .todo-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      cursor: pointer;
    }

    .todo-label input[type='checkbox'] {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    .todo-title {
      font-size: 1rem;
    }

    .delete-button {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .delete-button:hover {
      background-color: #c82333;
    }

    .delete-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }
  `,
})
export class TodoItemComponent {
  readonly todo = input.required<TodoItem>();

  readonly toggle = output<string>();
  readonly delete = output<string>();

  onToggle(): void {
    this.toggle.emit(this.todo().id);
  }

  onDelete(): void {
    this.delete.emit(this.todo().id);
  }
}