import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./components/todo-page/todo-page.component').then((m) => m.TodoPageComponent),
    canActivate: [authGuard],
  },
];