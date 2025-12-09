import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <li class="todo-item" data-testid="item-todo" [class.completed]="todo().completed">
      <label class="todo-label">
        <input
          type="checkbox"
          data-testid="checkbox-todoComplete"
          [checked]="todo().completed"
          (change)="onToggle()"
          aria-label="Mark as {{ todo().completed ? 'incomplete' : 'complete' }}"
        />

        @if (isEditing()) {
          <input
            #editInput
            type="text"
            class="edit-input"
            data-testid="input-todoEdit"
            [value]="todo().title"
            (keydown.enter)="onSave(editInput.value)"
            (keydown.escape)="onCancel()"
            (blur)="onSave(editInput.value)"
            aria-label="Edit todo title"
          />
        } @else {
        <span class="todo-title"
            data-testid="text-todoTitle"
            (click)="onStartEdit()"
            role="button"
            tabindex="0"
            (keydown.enter)="onStartEdit()"
            aria-label="Click to edit: {{ todo().title }}"
          >
            {{ todo().title }}
          </span>
        }
      </label>

      <div class="button-group">
        @if (isEditing()) {
          <button
            type="button"
            class="save-button"
            data-testid="button-todoSave"
            (click)="onSave(editInputRef()?. nativeElement?. value || '')"
            aria-label="Save changes"
          >
            Save
          </button>
          <button
            type="button"
            class="cancel-button"
            data-testid="button-todoCancel"
            (click)="onCancel()"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        } @else {
      <button
        type="button"
        data-testid="button-todoDelete"
        class="delete-button"
        (click)="onDelete()"
        [attr.aria-label]="'Delete ' + todo().title"
      >
        Delete
      </button>
        }
      </div>
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

    .todo-item.completed.todo-title {
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
      cursor: pointer;
      padding: 0.25rem 0. 5rem;
      border-radius: 4px;
    }

    .todo-title:hover {
      background-color: #f0f0f0;
    }

    .todo-title:focus {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }

    .edit-input {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border: 2px solid #0056b3;
      border-radius: 4px;
      outline: none;
    }

    .edit-input:focus {
      box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.2);
    }

    .button-group {
      display: flex;
      gap: 0. 5rem;
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

    .save-button {
      padding: 0.5rem 1rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .save-button:hover {
      background-color: #218838;
    }

    .save-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }

    .cancel-button {
      padding: 0.5rem 1rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0. 875rem;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }

    .cancel-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }
  `,
})
export class TodoItemComponent {
  readonly todo = input.required<TodoItem>();

  readonly toggle = output<string>();
  readonly delete = output<string>();
  readonly edit = output<{ id: string; title: string }>();

  readonly isEditing = signal(false);
  readonly editInputRef = viewChild<ElementRef<HTMLInputElement>>('editInput');

  onToggle(): void {
    this.toggle.emit(this.todo().id);
  }

  onDelete(): void {
    this.delete.emit(this.todo().id);
  }

  onStartEdit(): void {
    this.isEditing.set(true);

    // Focus the input after Angular renders it
    setTimeout(() => {
      const input = this.editInputRef()?.nativeElement;
      if (input) {
        input. focus();
        input.select();
      }
    });
  }

  onSave(newTitle: string): void {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle && trimmedTitle !== this.todo().title) {
      this.edit.emit({ id: this.todo().id, title: trimmedTitle });
    }

    this.isEditing.set(false);
  }

  onCancel(): void {
    this.isEditing.set(false);
  }
}