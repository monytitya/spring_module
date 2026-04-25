import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../core/services/common.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roles-container">
      <div class="page-header">
        <div class="header-left">
          <h1>Role Management</h1>
          <p class="subtitle">Manage user permissions and access levels.</p>
        </div>
        <button class="add-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Role
        </button>
      </div>

      <div class="roles-grid">
        <div class="card table-card">
          <div class="table-header">
            <h3>All Roles</h3>
            <div class="table-actions">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search roles...">
              </div>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let role of roles">
                  <td class="id-cell">#{{ role.id }}</td>
                  <td>
                    <span class="role-badge" [class]="role.name.toLowerCase()">
                      {{ role.name }}
                    </span>
                  </td>
                  <td class="desc-cell">{{ role.description }}</td>
                  <td>{{ role.createdAt | date:'mediumDate' }}</td>
                  <td>
                    <div class="actions">
                      <button class="action-btn edit" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="action-btn delete" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roles-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left h1 { font-size: 1.85rem; font-weight: 800; color: #111827; margin: 0; }
    .header-left .subtitle { color: #6B7280; font-size: 0.95rem; margin-top: 0.25rem; }

    .add-btn {
      background: #4F46E5;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
      transition: all 0.2s;
    }

    .add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3); }
    .add-btn svg { width: 18px; height: 18px; }

    .card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid #E5E7EB;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .table-header h3 { font-size: 1.25rem; font-weight: 700; margin: 0; }

    .search-box {
      display: flex;
      align-items: center;
      background: #F3F4F6;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      width: 280px;
      border: 1px solid transparent;
    }

    .search-box:focus-within { background: white; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
    .search-box svg { width: 16px; height: 16px; color: #9CA3AF; margin-right: 0.75rem; }
    .search-box input { border: none; background: transparent; outline: none; font-size: 0.9rem; width: 100%; }

    .table-wrapper { overflow-x: auto; }

    table { width: 100%; border-collapse: collapse; text-align: left; }
    
    th {
      padding: 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #F3F4F6;
    }

    td { padding: 1.25rem 1rem; font-size: 0.95rem; border-bottom: 1px solid #F3F4F6; }

    .id-cell { font-family: monospace; color: #9CA3AF; font-weight: 500; }
    .desc-cell { color: #6B7280; max-width: 300px; }

    .role-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .role-badge.admin { background: #EEF2FF; color: #4F46E5; }
    .role-badge.manager { background: #ECFDF5; color: #059669; }
    .role-badge.staff { background: #FFF7ED; color: #D97706; }

    .actions { display: flex; gap: 0.5rem; }

    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.edit { background: #F3F4F6; color: #4B5563; }
    .action-btn.edit:hover { background: #E5E7EB; color: #111827; }

    .action-btn.delete { background: #FEF2F2; color: #EF4444; }
    .action-btn.delete:hover { background: #FEE2E2; color: #DC2626; }

    .action-btn svg { width: 18px; height: 18px; }
  `]
})
export class RolesComponent implements OnInit {
  roles: any[] = [];

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }
}
