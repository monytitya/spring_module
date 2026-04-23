import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/common.service';
import { MenuItem } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-container">
      <div class="page-header">
        <h1>Menu Management</h1>
        <button class="btn-primary">+ Add New Item</button>
      </div>

      <div class="menu-grid">
        <div class="menu-item-card card" *ngFor="let item of menuItems">
          <div class="status-indicator" [class.available]="item.available"></div>
          <div class="item-header">
            <img [src]="item.imagePath ? 'http://localhost:9009' + item.imagePath : 'https://ui-avatars.com/api/?name=' + item.name + '&background=random'" alt="Menu Image">
            <div class="category-badge">{{ item.category.name }}</div>
          </div>
          <div class="item-body">
            <h3>{{ item.name }}</h3>
            <p class="description">{{ item.description }}</p>
            <div class="item-footer">
              <span class="price">\$ {{ item.price | number:'1.2-2' }}</span>
              <div class="actions">
                <button class="action-btn">✏️</button>
                <button class="action-btn delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .menu-item-card {
      padding: 0;
      overflow: hidden;
      position: relative;
      transition: transform 0.2s;
    }
    .menu-item-card:hover { transform: translateY(-5px); }

    .status-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #CBD5E0;
      z-index: 10;
      border: 2px solid white;
    }
    .status-indicator.available { background: #10B981; }

    .item-header {
      position: relative;
      height: 160px;
    }
    .item-header img { width: 100%; height: 100%; object-fit: cover; }

    .category-badge {
      position: absolute;
      bottom: -10px;
      left: 1rem;
      background: var(--orange-gradient);
      color: white;
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .item-body { padding: 1.5rem; padding-top: 2rem; }
    .item-body h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .description { font-size: 0.85rem; color: var(--text-secondary); height: 2.5rem; overflow: hidden; margin-bottom: 1rem; }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .price { font-weight: 700; font-size: 1.25rem; color: var(--text-main); }

    .actions { display: flex; gap: 0.5rem; }
    .action-btn {
      background: var(--bg-page);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .action-btn.delete:hover { background: #FEE2E2; }
  `]
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe(data => this.menuItems = data);
  }
}
