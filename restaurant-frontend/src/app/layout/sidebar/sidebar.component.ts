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
        <div class="logo-circle">L</div>
        <span class="logo-text">Lezato<span class="dot">.</span></span>
      </div>
      
      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </span>
          Dashboard
        </a>
        <a routerLink="/orders" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </span>
          Orders
        </a>
        <a routerLink="/payments" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </span>
          Payments
        </a>
        <a routerLink="/menu" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
          </span>
          Menus
        </a>
        <a routerLink="/tables" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          </span>
          Tables
        </a>
        <a routerLink="/kitchen" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1 1.5 1 4.5-.5 6-2.75 2.75-5.5 2.75-5.5 2.75s-2.75 0-5.5-2.75c-1.5-1.5-1.5-4.5-.5-6 1.5-2 3-4 3.5-6.5 2.224 1.946 3.072 3.857 2 6-.5 1-1 1.62-1 3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
          </span>
          Kitchen
        </a>
        <a routerLink="/customers" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </span>
          Customers
        </a>
        <a routerLink="/roles" routerLinkActive="active" class="nav-item">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </span>
          Roles
        </a>
      </nav>

      <div class="add-menu-card">
        <div class="card-glow"></div>
        <div class="pot-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="card-content">
          <p class="title">Add Menus</p>
          <p class="small">Manage your food and beverages menus</p>
        </div>
        <button class="arrow-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
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
      padding-left: 0.5rem;
    }

    .logo-circle {
      background: var(--orange-gradient);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.4rem;
      box-shadow: 0 4px 12px rgba(255, 102, 53, 0.3);
    }

    .logo-text {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.5px;
    }

    .dot { color: var(--primary); }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      text-decoration: none;
    }

    .icon-wrapper {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .icon-wrapper svg {
      width: 20px;
      height: 20px;
      opacity: 0.7;
    }

    .nav-item:hover {
      background: var(--primary-light);
      color: var(--primary);
      padding-left: 1.25rem;
    }

    .nav-item:hover .icon-wrapper svg {
      opacity: 1;
      transform: scale(1.1);
    }

    .nav-item.active {
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 600;
    }

    .nav-item.active .icon-wrapper svg {
      opacity: 1;
      stroke-width: 2.5;
    }

    .add-menu-card {
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      border-radius: 20px;
      padding: 1.25rem;
      color: white;
      margin-top: auto;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
    }

    .card-glow {
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.1);
      filter: blur(40px);
      border-radius: 50%;
    }

    .pot-icon { 
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .pot-icon svg { width: 24px; height: 24px; }

    .card-content .title { font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem; }
    .card-content .small { font-size: 0.75rem; opacity: 0.85; line-height: 1.3; }
    
    .arrow-btn {
      position: absolute;
      right: 1.25rem;
      top: 1.25rem;
      background: white;
      border: none;
      color: #4F46E5;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .arrow-btn:hover { transform: scale(1.1); }
    .arrow-btn svg { width: 16px; height: 16px; }

    .sidebar-footer {
      font-size: 0.75rem;
      color: var(--text-secondary);
      padding-left: 0.5rem;
    }

    .copyright { opacity: 0.6; margin-top: 0.25rem; }
  `]
})
export class SidebarComponent {}
