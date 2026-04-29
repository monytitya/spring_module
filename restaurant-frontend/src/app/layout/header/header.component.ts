import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Staff } from '../../core/models/restaurant.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="toggle-sidebar" (click)="toggleSidebar()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="16" y2="18"></line></svg>
        </button>
        <div class="search-bar">
          <span class="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input type="text" placeholder="Search here">
        </div>
      </div>

      <div class="header-center">
        <nav class="header-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Management</a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-link">Setting</a>
          <a href="javascript:void(0)" class="nav-link">Help</a>
        </nav>
      </div>
      
      <div class="header-actions">
        <button class="recipe-guide-btn">Restaurant</button>
        
        <div class="notifications">
          <div class="icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge">4</span>
          </div>
        </div>
        
        <div class="user-profile" *ngIf="authService.currentUser$ | async as user" (click)="showMenu = !showMenu">
          <div class="avatar-circle" [style.background]="'#FFB399'">
            {{ getInitials(user.name) }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role">{{ (user.roleName || 'Staff') | titlecase }}</span>
          </div>

          <!-- Profile Dropdown -->
          <div class="dropdown-menu" *ngIf="showMenu">
            <div class="dropdown-header">
              <p class="name">{{ user.name }}</p>
              <p class="role">{{ (user.roleName || 'Staff') }}</p>
            </div>
            <div class="divider"></div>
            <button (click)="logout()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 85px;
      background: white;
      border-bottom: 1px solid #F1F5F9;
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      transition: all 0.3s ease;
    }

    .header-left { flex: 1; display: flex; align-items: center; gap: 1.5rem; }
    
    .toggle-sidebar {
      background: #F1F5F9;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748B;
      transition: all 0.2s;
    }
    .toggle-sidebar:hover { background: #E2E8F0; color: #FF7043; }
    .toggle-sidebar svg { width: 20px; height: 20px; }
    .search-bar { 
      display: flex; 
      align-items: center; 
      background: #F8FAFC; 
      padding: 0.8rem 1.25rem; 
      border-radius: 16px; 
      width: 100%;
      max-width: 320px;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .search-bar:focus-within { background: white; border-color: #FF7043; box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.08); }
    .search-icon svg { width: 18px; height: 18px; color: #94A3B8; }
    .search-bar input { border: none; background: transparent; outline: none; margin-left: 0.75rem; width: 100%; font-size: 0.95rem; color: #1E293B; }
    .search-bar input::placeholder { color: #94A3B8; }

    .header-center { flex: 1; display: flex; justify-content: center; }
    .header-nav { display: flex; gap: 2.5rem; align-items: center; }
    .nav-link { 
      text-decoration: none; 
      color: #64748B; 
      font-weight: 600; 
      font-size: 0.95rem; 
      transition: all 0.2s;
      position: relative;
      padding: 0.5rem 0;
    }
    .nav-link:hover { color: #FF7043; }
    .nav-link.active { color: #FF7043; }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #FF7043;
      border-radius: 2px;
    }

    .header-actions { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 1.5rem; }
    
    .recipe-guide-btn { 
      background: #FF7043; 
      color: white; 
      border: none; 
      padding: 0.75rem 1.5rem; 
      border-radius: 16px; 
      font-weight: 700; 
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(255, 112, 67, 0.2);
      transition: all 0.2s;
    }
    .recipe-guide-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(255, 112, 67, 0.25); }

    .icon-wrap { 
      background: #F8FAFC; 
      width: 46px; 
      height: 46px; 
      border-radius: 14px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      position: relative; 
      cursor: pointer;
      border: 1px solid #F1F5F9;
      transition: all 0.2s;
    }
    .icon-wrap:hover { background: white; border-color: #E2E8F0; transform: translateY(-2px); }
    .icon-wrap svg { width: 22px; height: 22px; color: #475569; }
    .badge { 
      position: absolute; 
      top: -4px; 
      right: -4px; 
      background: #FF7043; 
      color: white; 
      font-size: 0.7rem; 
      min-width: 200x; 
      height: 20px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      border-radius: 50%; 
      font-weight: 800; 
      border: 3px solid white; 
    }

    .user-profile { 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      cursor: pointer; 
      padding: 0.4rem; 
      border-radius: 16px; 
      position: relative;
      background: #F8FAFC;
      border: 1px solid #F1F5F9;
      transition: all 0.2s;
    }
    .user-profile:hover { border-color: #E2E8F0; background: white; }
    
    .avatar-circle { 
      width: 40px; 
      height: 40px; 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-weight: 800;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .user-info { display: flex; flex-direction: column; padding-right: 0.5rem; }
    .user-name { font-weight: 700; font-size: 0.95rem; color: #1E293B; line-height: 1.2; }
    .user-role { font-size: 0.75rem; color: #64748B; font-weight: 500; }

    .dropdown-menu {
      position: absolute;
      top: 110%;
      right: 0;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
      border: 1px solid #F1F5F9;
      padding: 0.75rem;
      min-width: 200px;
      animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    .dropdown-header { padding: 0.75rem 1rem; }
    .dropdown-header .name { font-weight: 800; color: #1E293B; margin: 0; }
    .dropdown-header .role { font-size: 0.8rem; color: #64748B; margin: 0.2rem 0 0 0; }
    
    .divider { height: 1px; background: #F1F5F9; margin: 0.5rem 0; }

    .dropdown-menu button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.8rem 1rem;
      border: none;
      background: none;
      color: #64748B;
      font-weight: 600;
      cursor: pointer;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .dropdown-menu button:hover { background: #F8FAFC; color: #EF4444; }
    .dropdown-menu button svg { width: 18px; height: 18px; }
  `]
})
export class HeaderComponent implements OnInit {
  showMenu = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  toggleSidebar(): void {
    // This could emit an event to a shared service to collapse the sidebar
    console.log('Toggle sidebar clicked');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userProfile = target.closest('.user-profile');
    if (!userProfile && this.showMenu) {
      this.showMenu = false;
    }
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  }

  logout(): void {
    this.showMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
