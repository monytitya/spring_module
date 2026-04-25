import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
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
          <h1>Create Account</h1>
          <p class="subtitle">Join us and start managing your restaurant.</p>
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <div class="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input type="text" id="name" name="name" [(ngModel)]="regData.name" placeholder="John Doe" required>
              </div>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <div class="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <input type="text" id="phone" name="phone" [(ngModel)]="regData.phone" placeholder="012 345 678" required>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" id="email" name="email" [(ngModel)]="regData.email" placeholder="john@example.com" required>
            </div>
          </div>

          <div class="form-group">
            <label for="pin">PIN Code (4 digits)</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input type="password" id="pin" name="pin" [(ngModel)]="regData.pin" placeholder="••••" maxlength="4" required>
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="!registerForm.valid">
            Create Account
          </button>
        </form>

        <div class="auth-bottom">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
      
      <div class="auth-visual">
        <div class="visual-content">
          <div class="quote-card">
            <p>"The best software I've ever used for my restaurant. Simple, fast and efficient."</p>
            <div class="author">
              <div class="avatar">JS</div>
              <div>
                <p class="name">John Smith</p>
                <p class="role">CEO of Lezato Group</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; min-height: 100vh; background: white; }

    .auth-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4rem;
      max-width: 650px;
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

    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

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

    .input-wrap svg { width: 18px; height: 18px; color: #9CA3AF; margin-right: 1rem; }
    .input-wrap input { border: none; background: transparent; outline: none; width: 100%; font-size: 1rem; color: #111827; }

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
      flex: 1;
      background: #F3F4F6 url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000') no-repeat center center;
      background-size: cover;
      display: flex;
      align-items: flex-end;
      padding: 4rem;
      position: relative;
    }

    .auth-visual::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
    }

    .visual-content { position: relative; z-index: 1; width: 100%; }

    .quote-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      padding: 2rem;
      border-radius: 24px;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .quote-card p { font-size: 1.5rem; font-weight: 500; font-style: italic; line-height: 1.4; margin-bottom: 1.5rem; }
    
    .author { display: flex; align-items: center; gap: 1rem; }
    .avatar { width: 48px; height: 48px; background: #FF6635; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .author .name { font-weight: 700; margin: 0; }
    .author .role { font-size: 0.85rem; opacity: 0.7; margin: 0; }

    @media (max-width: 1024px) {
      .auth-visual { display: none; }
      .auth-card { max-width: 100%; }
    }
  `]
})
export class RegisterComponent {
  regData = { name: '', phone: '', email: '', pin: '' };

  constructor(private router: Router) {}

  onRegister(): void {
    // Demo navigation
    this.router.navigate(['/login']);
  }
}
