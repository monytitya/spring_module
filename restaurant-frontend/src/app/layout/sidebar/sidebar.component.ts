import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="logo">
        <span class="logo-circle">L</span>
        <span class="logo-text">Lezato<span class="dot">.</span></span>
      </div>
      
      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <i class="icon">📊</i> Dashboard
        </a>
        <a routerLink="/orders" routerLinkActive="active" class="nav-item">
          <i class="icon">📋</i> Orders
        </a>
        <a routerLink="/payments" routerLinkActive="active" class="nav-item">
          <i class="icon">💰</i> Payments
        </a>
        <a routerLink="/menu" routerLinkActive="active" class="nav-item">
          <i class="icon">🍔</i> Menus
        </a>
        <a routerLink="/tables" routerLinkActive="active" class="nav-item">
          <i class="icon">🪑</i> Tables
        </a>
        <a routerLink="/kitchen" routerLinkActive="active" class="nav-item">
          <i class="icon">🍳</i> Kitchen
        </a>
        <a routerLink="/customers" routerLinkActive="active" class="nav-item">
          <i class="icon">👥</i> Customers
        </a>
      </nav>

      <div class="add-menu-card">
        <div class="pot-icon">🍲</div>
        <p>Add Menus</p>
        <p class="small">Manage your food and beverages menus</p>
        <button class="arrow-btn">→</button>
      </div>

      <div class="sidebar-footer">
        <p>Lezato Restaurant Admin</p>
        <p class="copyright">© 2026 All Rights Reserved</p>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: white;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      padding: 1.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .logo-circle {
      background: var(--orange-gradient);
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .dot { color: var(--primary); }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--primary-light);
      color: var(--primary);
    }

    .icon { font-style: normal; font-size: 1.2rem; }

    .add-menu-card {
      background: #6366F1;
      border-radius: var(--radius);
      padding: 1rem;
      color: white;
      margin-top: auto;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .pot-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .small { font-size: 0.75rem; opacity: 0.8; }
    
    .arrow-btn {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
    }

    .sidebar-footer {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .copyright { opacity: 0.6; margin-top: 0.25rem; }
  `]
})
export class SidebarComponent {}
