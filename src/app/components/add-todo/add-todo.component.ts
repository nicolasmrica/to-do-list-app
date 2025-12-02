import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="add-todo-form">
      <div class="form-group">
        <label for="todoTitle" class="visually-hidden">New todo title</label>
        <input
          id="todoTitle"
          data-testid="input-todoTitle"
          type="text"
          formControlName="title"
          placeholder="What needs to be done?"
          class="todo-input"
          [attr.aria-invalid]="todoForm.controls.title.invalid && todoForm.controls.title.touched"
          aria-describedby="titleError"
        />
        @if (todoForm.controls.title.invalid && todoForm.controls.title.touched) {
          <span id="titleError" class="error-message" role="alert">
            Please enter a todo title
          </span>
        }
      </div>
      <button
        type="submit"
        class="add-button"
        data-testid="button-addButton"
        [disabled]="todoForm.invalid"
        aria-label="Add new todo"
      >
        Add
      </button>
    </form>
  `,
  styles: `
    .add-todo-form {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .todo-input {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
    }

    .todo-input:focus {
      outline: 2px solid #0056b3;
      outline-offset: 1px;
      border-color: #0056b3;
    }

    .todo-input[aria-invalid='true'] {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
    }

    .add-button {
      padding: 0.75rem 1.5rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }

    .add-button:hover:not(:disabled) {
      background-color: #218838;
    }

    .add-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .add-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
})
export class AddTodoComponent {
  private readonly fb = new FormBuilder();

  readonly todoForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
  });

  readonly addTodo = output<string>();

  onSubmit(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.controls.title.value;
      this.addTodo.emit(title);
      this.todoForm.reset();
    }
  }
}