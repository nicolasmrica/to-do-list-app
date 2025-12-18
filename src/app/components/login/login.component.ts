import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h1 id="login-heading">Sign In</h1>

      <form
        [formGroup]="loginForm"
        (ngSubmit)="onSubmit()"
        aria-labelledby="login-heading"
      >
        @if (errorMessage()) {
          <div
            class="error-banner"
            role="alert"
            aria-live="assertive"
            data-testid="alert-loginError"
          >
            {{ errorMessage() }}
          </div>
        }

        <div class="form-field">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            autocomplete="username"
            data-testid="input-username"
            [attr.aria-invalid]="isFieldInvalid('username')"
            [attr.aria-describedby]="isFieldInvalid('username') ? 'username-error' : null"
          />
          @if (isFieldInvalid('username')) {
            <span id="username-error" class="field-error" role="alert">
              Username is required
            </span>
          }
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
            data-testid="input-password"
            [attr.aria-invalid]="isFieldInvalid('password')"
            [attr.aria-describedby]="isFieldInvalid('password') ? 'password-error' : null"
          />
          @if (isFieldInvalid('password')) {
            <span id="password-error" class="field-error" role="alert">
              Password is required
            </span>
          }
        </div>

        <button
          type="submit"
          class="submit-button"
          data-testid="button-login"
          [attr.aria-disabled]="isSubmitting()"
        >
          @if (isSubmitting()) {
            Signing in...
          } @else {
            Sign In
          }
        </button>
      </form>
    </div>
  `,
  styles: `
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin:  0 0 1.5rem 0;
      text-align: center;
      color: #0056b3;
      font-size: 1.75rem;
    }

    .error-banner {
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
      font-size:  0.875rem;
    }

    .form-field {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight:  500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
      border-color: #0056b3;
    }

    input[aria-invalid='true'] {
      border-color: #dc3545;
    }

    input[aria-invalid='true']:focus {
      outline-color: #dc3545;
    }

    .field-error {
      display: block;
      margin-top: 0.25rem;
      color: #dc3545;
      font-size: 0.875rem;
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem 1rem;
      background-color: #0056b3;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }

    .submit-button:hover {
      background-color: #004494;
    }

    .submit-button:focus-visible {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }

    .submit-button[aria-disabled='true'] {
      opacity:  0.7;
      cursor: not-allowed;
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);

  readonly loginForm = this.fb.nonNullable.group({
    username:  ['', [Validators.required]],
    password:  ['', [Validators.required]],
  });

  isFieldInvalid(fieldName: 'username' | 'password'): boolean {
    const control = this.loginForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.getRawValue();
    const success = this.authService.login(username, password);

    if (success) {
      this.router.navigate(['/todos']);
    } else {
      this.errorMessage.set('Invalid username or password');
      this.isSubmitting.set(false);
    }
  }
}