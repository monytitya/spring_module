import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../core/services/common.service';
import { Staff } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="search-bar">
        <span class="search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input type="text" placeholder="Search here">
      </div>
      
      <div class="header-actions">
        <button class="recipe-guide-btn">Recipe Guide</button>
        
        <div class="notifications">
          <div class="icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge">4</span>
          </div>
          <div class="icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span class="badge secondary">21</span>
          </div>
        </div>
        
        <div class="user-profile" *ngIf="currentUser">
          <div class="avatar-circle" [style.background]="'#FFB399'">
            {{ getInitials(currentUser.name) }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ currentUser.name }}</span>
            <span class="user-role">{{ currentUser.role.name || 'Staff' | titlecase }}</span>
          </div>
        </div>
        
        <div class="lang-selector">
          <img src="https://flagcdn.com/w20/us.png" alt="English">
          <span>English</span>
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 80px;
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
      padding: 0 2.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }

    .search-bar {
      display: flex;
      align-items: center;
      background: #F3F4F6;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      width: 400px;
      transition: all 0.3s;
      border: 1px solid transparent;
    }

    .search-bar:focus-within {
      background: white;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-light);
    }

    .search-icon svg { width: 18px; height: 18px; color: var(--text-secondary); }

    .search-bar input {
      border: none;
      background: transparent;
      outline: none;
      margin-left: 0.75rem;
      width: 100%;
      font-family: inherit;
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }

    .recipe-guide-btn {
      background: #FF7043;
      color: white;
      border: none;
      padding: 0.75rem 1.75rem;
      border-radius: 16px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 112, 67, 0.2);
      transition: all 0.2s;
    }

    .recipe-guide-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(255, 112, 67, 0.3);
    }

    .notifications {
      display: flex;
      gap: 1rem;
    }

    .icon-wrap {
      background: #F3F4F6;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-wrap:hover { background: #E5E7EB; transform: scale(1.05); }

    .icon-wrap svg { width: 20px; height: 20px; color: #4B5563; }

    .badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #FF7043;
      color: white;
      font-size: 0.7rem;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 700;
      border: 2px solid white;
    }

    .badge.secondary { background: #6366F1; }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .user-profile:hover { background: #F9FAFB; }

    .avatar-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name { font-weight: 700; font-size: 1rem; color: #111827; }
    .user-role { font-size: 0.8rem; color: #6B7280; font-weight: 500; }

    .lang-selector {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #F9FAFB;
      padding: 0.6rem 1rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      border: 1px solid #F3F4F6;
    }

    .lang-selector img { border-radius: 2px; }
    .arrow { width: 12px; height: 12px; color: #9CA3AF; }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser?: Staff;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    // Fetch the admin user (assuming ID 1 for now)
    this.staffService.getStaffById(1).subscribe(staff => {
      this.currentUser = staff;
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
