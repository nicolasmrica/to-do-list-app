import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TodoItem } from '../../models/todo-item.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TodoItemComponent],
  template: `
    @if (todos().length === 0) {
      <p class="empty-message" role="status" data-testid="text-emptyMessage">
        No todos yet. Add one above!
      </p>
    } @else {
      <ul class="todo-list" aria-label="Todo list" data-testid="list-todos">
        @for (todo of todos(); track todo.id) {
          <app-todo-item
            [todo]="todo"
            (toggle)="onToggle($event)"
            (delete)="onDelete($event)"
          />
        }
      </ul>
    }
  `,
  styles: `
    .todo-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .empty-message {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-style: italic;
    }
  `,
})
export class TodoListComponent {
  readonly todos = input.required<TodoItem[]>();

  readonly toggle = output<string>();
  readonly delete = output<string>();

  onToggle(id: string): void {
    this.toggle.emit(id);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }
}