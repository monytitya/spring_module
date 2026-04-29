import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <div class="logo-circle">L</div>
            <span class="logo-text">Lezato<span class="dot">.</span></span>
          </div>
          <h1>Welcome Back!</h1>
          <p class="subtitle">Please enter your Phone number and PIN to sign in.</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <input type="text" id="phone" name="phone" [(ngModel)]="loginData.phone" (focus)="clearError()" placeholder="Enter your phone number" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="pin">PIN / Password</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input type="password" id="pin" name="pin" [(ngModel)]="loginData.pin" (focus)="clearError()" placeholder="Enter your 6-digit PIN" required maxlength="6">
            </div>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <button type="submit" class="submit-btn" [disabled]="!loginForm.valid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-bottom">
          <p>Don't have an account? <a routerLink="/register">Sign up for free</a></p>
        </div>
      </div>
      
      <div class="auth-visual">
        <div class="visual-content">
          <h2>Experience the best restaurant management system.</h2>
          <p>Streamline your operations and delight your customers with Lezato.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; min-height: 100vh; background: white; }
    .auth-card { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 4rem; max-width: 600px; margin: 0 auto; }
    .auth-header { margin-bottom: 2.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
    .logo-circle { background: linear-gradient(135deg, #FF9E6F 0%, #FF6635 100%); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; }
    .logo-text { font-size: 1.6rem; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
    .dot { color: #FF6635; }
    .auth-header h1 { font-size: 2.25rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
    .auth-header .subtitle { color: #6B7280; font-size: 1.1rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; font-size: 0.95rem; color: #374151; }
    .input-wrap { display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 14px; padding: 0.85rem 1.25rem; transition: all 0.2s; }
    .input-wrap:focus-within { background: white; border-color: #FF6635; box-shadow: 0 0 0 4px rgba(255, 102, 53, 0.1); }
    .input-wrap svg { width: 20px; height: 20px; color: #9CA3AF; margin-right: 1rem; }
    .input-wrap input { border: none; background: transparent; outline: none; width: 100%; font-size: 1rem; color: #111827; }
    .error-message { color: #EF4444; font-size: 0.9rem; font-weight: 600; }
    .submit-btn { background: #111827; color: white; border: none; padding: 1rem; border-radius: 14px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 1rem; transition: all 0.2s; }
    .submit-btn:hover:not(:disabled) { background: #1F2937; transform: translateY(-2px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-bottom { margin-top: 2rem; text-align: center; color: #6B7280; font-size: 0.95rem; }
    .auth-bottom a { color: #FF6635; font-weight: 700; text-decoration: none; }
    .auth-visual { flex: 1.2; background: linear-gradient(135deg, #111827 0%, #374151 100%); display: flex; align-items: center; justify-content: center; padding: 4rem; color: white; position: relative; overflow: hidden; }
    .visual-content { position: relative; z-index: 1; max-width: 500px; }
    .visual-content h2 { font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; }
    .visual-content p { font-size: 1.25rem; opacity: 0.8; line-height: 1.6; }
    @media (max-width: 1024px) { .auth-visual { display: none; } .auth-card { max-width: 100%; } }
  `]
})
export class LoginComponent {
  loginData = { phone: '', pin: '' };
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (!this.loginData.phone.trim() || !this.loginData.pin.trim()) {
      this.error = 'Please enter both phone number and PIN.';
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    this.authService.login(this.loginData.phone.trim(), this.loginData.pin).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid Phone or PIN code. Please try again.';
      }
    });
  }

  clearError(): void {
    if (this.error) {
      this.error = '';
    }
  }
}
