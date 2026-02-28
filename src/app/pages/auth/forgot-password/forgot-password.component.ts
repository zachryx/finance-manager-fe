import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Reset your password</h2>
          <p class="mt-2 text-sm text-gray-600">
            Remember your password? <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
          </p>
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div *ngIf="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <div *ngIf="success" class="text-green-600 text-sm text-center">
            {{ success }}
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response?.message || 'Password reset link sent to your email';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to send reset link. Please try again.';
      },
    });
  }
}
