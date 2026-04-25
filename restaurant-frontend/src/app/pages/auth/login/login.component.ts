import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
          <p class="subtitle">Please enter your details to sign in.</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email or Phone</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="text" id="email" name="email" [(ngModel)]="loginData.email" placeholder="Enter your email" required>
            </div>
          </div>

          <div class="form-group">
            <label for="pin">PIN / Password</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input type="password" id="pin" name="pin" [(ngModel)]="loginData.pin" placeholder="Enter your PIN" required>
            </div>
          </div>

          <div class="form-footer">
            <label class="remember-me">
              <input type="checkbox" name="remember">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="submit-btn" [disabled]="!loginForm.valid">
            Sign In
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
    .auth-container {
      display: flex;
      min-height: 100vh;
      background: white;
    }

    .auth-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .auth-header { margin-bottom: 2.5rem; }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .logo-circle {
      background: linear-gradient(135deg, #FF9E6F 0%, #FF6635 100%);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.4rem;
    }

    .logo-text { font-size: 1.6rem; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
    .dot { color: #FF6635; }

    .auth-header h1 { font-size: 2.25rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
    .auth-header .subtitle { color: #6B7280; font-size: 1.1rem; }

    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; font-size: 0.95rem; color: #374151; }

    .input-wrap {
      display: flex;
      align-items: center;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 14px;
      padding: 0.85rem 1.25rem;
      transition: all 0.2s;
    }

    .input-wrap:focus-within {
      background: white;
      border-color: #FF6635;
      box-shadow: 0 0 0 4px rgba(255, 102, 53, 0.1);
    }

    .input-wrap svg { width: 20px; height: 20px; color: #9CA3AF; margin-right: 1rem; }
    .input-wrap input { border: none; background: transparent; outline: none; width: 100%; font-size: 1rem; color: #111827; }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .remember-me { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #6B7280; }
    .remember-me input { width: 18px; height: 18px; border-radius: 6px; border: 1px solid #D1D5DB; }

    .forgot-link { color: #FF6635; font-weight: 600; text-decoration: none; }

    .submit-btn {
      background: #111827;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.2s;
    }

    .submit-btn:hover:not(:disabled) { background: #1F2937; transform: translateY(-2px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .auth-bottom { margin-top: 2rem; text-align: center; color: #6B7280; font-size: 0.95rem; }
    .auth-bottom a { color: #FF6635; font-weight: 700; text-decoration: none; }

    .auth-visual {
      flex: 1.2;
      background: linear-gradient(135deg, #111827 0%, #374151 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .auth-visual::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 300px;
      height: 300px;
      background: rgba(255, 102, 53, 0.15);
      filter: blur(80px);
      border-radius: 50%;
    }

    .visual-content { position: relative; z-index: 1; max-width: 500px; }
    .visual-content h2 { font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; }
    .visual-content p { font-size: 1.25rem; opacity: 0.8; line-height: 1.6; }

    @media (max-width: 1024px) {
      .auth-visual { display: none; }
      .auth-card { max-width: 100%; }
    }
  `]
})
export class LoginComponent {
  loginData = { email: '', pin: '' };

  constructor(private router: Router) { }

  onLogin(): void {
    this.router.navigate(['/dashboard']);
  }
}
