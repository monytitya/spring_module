import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search here">
      </div>
      
      <div class="header-actions">
        <button class="recipe-guide-btn">Recipe Guide</button>
        <div class="notifications">
          <div class="icon-wrap">
            🔔
            <span class="badge">4</span>
          </div>
          <div class="icon-wrap">
            💬
            <span class="badge secondary">21</span>
          </div>
        </div>
        
        <div class="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=FFB399&color=fff" alt="Avatar">
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        
        <div class="lang-selector">
          <img src="https://flagcdn.com/w20/us.png" alt="English">
          <span>English</span>
          <span class="arrow">▼</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      background: white;
      border-bottom: 1px solid var(--border);
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      z-index: 90;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }

    .search-bar {
      display: flex;
      align-items: center;
      background: var(--bg-page);
      padding: 0.6rem 1rem;
      border-radius: 10px;
      width: 400px;
    }

    .search-bar input {
      border: none;
      background: transparent;
      outline: none;
      margin-left: 0.75rem;
      width: 100%;
      font-family: inherit;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .recipe-guide-btn {
      background: var(--orange-gradient);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 50px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .notifications {
      display: flex;
      gap: 1rem;
    }

    .icon-wrap {
      background: var(--bg-page);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
    }

    .badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--primary);
      color: white;
      font-size: 0.65rem;
      padding: 2px 5px;
      border-radius: 10px;
      font-weight: 700;
    }

    .badge.secondary { background: #6366F1; }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .user-profile img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name { font-weight: 600; font-size: 0.9rem; }
    .user-role { font-size: 0.75rem; color: var(--text-secondary); }

    .lang-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-page);
      padding: 0.5rem 0.8rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent {}
