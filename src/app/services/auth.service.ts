import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);

  // Public readonly access to current user
  readonly currentUser = this.currentUserSignal.asReadonly();

  // Derived state using computed signal
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(username: string, password: string): boolean {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return false;
    }

    // Simple validation - in a real app, this would call an API
    if (trimmedPassword.length < 4) {
      return false;
    }

    const user: User = {
      id: crypto.randomUUID(),
      username: trimmedUsername,
    };

    this.currentUserSignal.set(user);
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}