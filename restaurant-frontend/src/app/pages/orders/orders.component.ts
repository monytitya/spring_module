import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { TableService, StaffService, MenuService } from '../../core/services/common.service';
import { Order, Table, Staff, MenuItem, OrderItem } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-container">
      <div class="page-header">
        <h1>Orders</h1>
        <button class="btn-primary" (click)="openCreateModal()">+ Create New Order</button>
      </div>

      <div class="filter-bar card">
        <div class="tabs">
          <button class="tab" [class.active]="filterStatus === 'all'" (click)="filterStatus = 'all'">All</button>
          <button class="tab" [class.active]="filterStatus === 'open'" (click)="filterStatus = 'open'">Open</button>
          <button class="tab" [class.active]="filterStatus === 'partial'" (click)="filterStatus = 'partial'">Partial</button>
          <button class="tab" [class.active]="filterStatus === 'closed'" (click)="filterStatus = 'closed'">Closed</button>
        </div>
        <div class="search-box">
          <input type="text" placeholder="Search order ID or table..." [(ngModel)]="searchQuery">
        </div>
      </div>

      <div class="orders-table card">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Staff</th>
              <th>Opened At</th>
              <th>Status</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>#{{ order.id }}</td>
              <td><span class="badge-table">{{ order.tableName }}</span></td>
              <td>{{ order.staffName }}</td>
              <td>{{ order.createdAt | date:'short' }}</td>
              <td>
                <span class="status-badge" [class]="order.status">{{ order.status }}</span>
              </td>
              <td>\$ {{ order.finalAmount | number:'1.2-2' }}</td>
              <td>\$ {{ order.paidAmount | number:'1.2-2' }}</td>
              <td class="text-orange">\$ {{ order.remainingAmount | number:'1.2-2' }}</td>
              <td>
                <div class="action-btns">
                  <button class="icon-btn" (click)="viewOrder(order)">👁️</button>
                  <button class="icon-btn delete" (click)="deleteOrder(order.id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Order Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal">
        <div class="modal card">
          <div class="modal-header">
            <h3>Create New Order</h3>
            <button class="close-btn" (click)="showCreateModal = false">×</button>
          </div>
          
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Select Table</label>
                <select [(ngModel)]="newOrder.tableId">
                  <option *ngFor="let t of tables" [value]="t.id">{{ t.tableNumber }} (Cap: {{ t.capacity }})</option>
                </select>
              </div>
              <div class="form-group">
                <label>Select Staff</label>
                <select [(ngModel)]="newOrder.staffId">
                  <option *ngFor="let s of staffs" [value]="s.id">{{ s.name }}</option>
                </select>
              </div>
            </div>

            <div class="item-selection">
              <label>Add Items</label>
              <div class="add-item-row">
                <select [(ngModel)]="selectedMenuItemId">
                  <option *ngFor="let item of menuItems" [value]="item.id">{{ item.name }} - \${{ item.price }}</option>
                </select>
                <input type="number" [(ngModel)]="selectedQty" min="1" style="width: 60px">
                <button class="btn-primary mini" (click)="addItem()">Add</button>
              </div>

              <div class="selected-items">
                <div class="item-row" *ngFor="let item of newOrder.items; let i = index">
                  <span>{{ getItemName(item.menuItemId) }} x{{ item.quantity }}</span>
                  <button class="remove-btn" (click)="removeItem(i)">×</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="showCreateModal = false">Cancel</button>
            <button class="btn-primary" (click)="submitOrder()" [disabled]="!newOrder.tableId || !newOrder.staffId || newOrder.items.length === 0">Create Order</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.5rem;
    }

    .tabs { display: flex; gap: 0.5rem; }
    .tab {
      background: transparent;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .tab.active { background: var(--primary-light); color: var(--primary); }

    .search-box input {
      background: var(--bg-page);
      border: 1px solid var(--border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      outline: none;
      width: 250px;
    }

    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem; font-size: 0.85rem; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }

    .badge-table {
      background: #E2E8F0;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-badge.open { background: #E0F2FE; color: #0369A1; }
    .status-badge.partial { background: #FEF3C7; color: #B45309; }
    .status-badge.closed { background: #DCFCE7; color: #15803D; }

    .action-btns { display: flex; gap: 0.5rem; }
    .icon-btn {
      background: var(--bg-page);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-btn.delete:hover { background: #FEE2E2; color: #EF4444; }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal { width: 500px; padding: 2rem; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .close-btn { font-size: 2rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; }
    .form-group select { border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px; outline: none; }

    .item-selection { margin-bottom: 1.5rem; }
    .add-item-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .add-item-row select { flex: 1; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px; }
    .btn-primary.mini { padding: 0.5rem 1rem; }

    .selected-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid var(--border);
      padding: 0.5rem;
      border-radius: 8px;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-page);
      padding: 0.5rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }
    .remove-btn { background: none; border: none; color: #EF4444; font-size: 1.2rem; cursor: pointer; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .btn-secondary { background: #E2E8F0; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  tables: Table[] = [];
  staffs: Staff[] = [];
  menuItems: MenuItem[] = [];

  filterStatus: 'all' | 'open' | 'partial' | 'closed' = 'all';
  searchQuery = '';
  showCreateModal = false;

  newOrder: any = { tableId: null, staffId: null, items: [] };
  selectedMenuItemId: number | null = null;
  selectedQty = 1;

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private staffService: StaffService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.refreshData();
    this.tableService.getTables().subscribe(t => this.tables = t);
    this.staffService.getStaff().subscribe(s => this.staffs = s);
    this.menuService.getMenuItems().subscribe(m => this.menuItems = m);
  }

  refreshData(): void {
    this.orderService.getAllOrders().subscribe(data => this.orders = data);
  }

  get filteredOrders() {
    return this.orders.filter(o => {
      const matchStatus = this.filterStatus === 'all' || o.status === this.filterStatus;
      const matchSearch = o.tableName.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          o.id.toString().includes(this.searchQuery);
      return matchStatus && matchSearch;
    }).sort((a, b) => b.id - a.id);
  }

  openCreateModal(): void {
    this.newOrder = { tableId: null, staffId: null, items: [] };
    this.showCreateModal = true;
  }

  addItem(): void {
    if (!this.selectedMenuItemId) return;
    this.newOrder.items.push({
      menuItemId: +this.selectedMenuItemId,
      quantity: this.selectedQty,
      notes: ''
    });
    this.selectedMenuItemId = null;
    this.selectedQty = 1;
  }

  removeItem(index: number): void {
    this.newOrder.items.splice(index, 1);
  }

  getItemName(id: number): string {
    return this.menuItems.find(m => m.id === id)?.name || 'Unknown';
  }

  submitOrder(): void {
    this.orderService.createOrder(this.newOrder).subscribe(() => {
      this.showCreateModal = false;
      this.refreshData();
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.refreshData());
    }
  }

  viewOrder(order: Order): void {
    // Navigate to payment page for POS view
    window.location.href = '/payments?orderId=' + order.id;
  }
}
