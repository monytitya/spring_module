import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/common.service';
import { Customer } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customers-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Loyal Customers</h1>
          <p class="subtitle">Track your most valued diners and their journey with you.</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Customer
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-content">
            <span class="label">Total Customers</span>
            <span class="value">{{ customers.length }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
          </div>
          <div class="stat-content">
            <span class="label">High Spenders</span>
            <span class="value">{{ getHighSpendersCount() }}</span>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="table-card">
        <div class="table-actions">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search by name, email or phone..." [(ngModel)]="searchTerm">
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Visit</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredCustomers()">
              <td>
                <div class="user-cell">
                  <div *ngIf="c.imagePath" class="avatar-image">
                    <img [src]="c.imagePath" [alt]="c.name" />
                  </div>
                  <div *ngIf="!c.imagePath" class="avatar" [style.background]="getAvatarColor(c.name)">
                    {{ getInitials(c.name) }}
                  </div>
                  <div class="user-info">
                    <span class="name">{{ c.name }}</span>
                    <span class="since">Joined {{ c.createdAt | date:'MMM yyyy' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-cell">
                  <span class="phone">{{ c.phone }}</span>
                  <span class="email">{{ c.email }}</span>
                </div>
              </td>
              <td>
                <div class="orders-badge">
                  {{ c.totalOrders }} Orders
                </div>
              </td>
              <td>
                <span class="spent-value">\$ {{ c.totalSpent | number:'1.2-2' }}</span>
              </td>
              <td>
                <span class="visit-date">{{ c.lastVisit ? (c.lastVisit | date:'shortDate') : 'Never' }}</span>
              </td>
              <td class="text-right">
                <div class="action-group">
                  <button class="action-btn edit" (click)="openEditModal(c)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="action-btn delete" (click)="deleteCustomer(c.id)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredCustomers().length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3>No customers found</h3>
          <p>Try adjusting your search or add a new customer.</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editId ? 'Edit Customer' : 'Add New Customer' }}</h2>
          <button class="close-btn" (click)="showModal = false">×</button>
        </div>
        <form (ngSubmit)="saveCustomer()">
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group full">
                <label>Full Name</label>
                <input type="text" name="name" [(ngModel)]="customerForm.name" required placeholder="e.g. John Doe">
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" [(ngModel)]="customerForm.phone" required placeholder="e.g. 012-345-678">
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" [(ngModel)]="customerForm.email" required placeholder="e.g. john@example.com">
              </div>
              <div class="form-group full">
                <label>Home Address (Optional)</label>
                <textarea name="address" [(ngModel)]="customerForm.address" rows="2" placeholder="Street, City, Postcode..."></textarea>
              </div>
              <div class="form-group full">
                <label>Customer Photo (Optional)</label>
                <div class="image-upload-wrapper">
                  <div *ngIf="imagePreview" class="image-preview">
                    <img [src]="imagePreview" alt="Preview">
                    <button type="button" class="remove-image" (click)="removeImage()" title="Remove image">×</button>
                  </div>
                  <label class="image-upload-input" [class.has-image]="imagePreview">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <span>{{ imagePreview ? 'Change Photo' : 'Upload Photo' }}</span>
                    <input type="file" accept="image/*" (change)="onImageSelected($event)" hidden>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" (click)="showModal = false">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="isSaving">
              {{ isSaving ? 'Saving...' : (editId ? 'Update Customer' : 'Add Customer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .customers-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.4s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-info h1 { font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.02em; }
    .header-info .subtitle { color: #6B7280; font-size: 1rem; margin-top: 0.4rem; }

    .btn-primary {
      background: #FF7043;
      color: white;
      border: none;
      padding: 0 1.5rem;
      height: 48px;
      border-radius: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(255, 112, 67, 0.25);
      transition: all 0.3s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(255, 112, 67, 0.35); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon svg { width: 28px; height: 28px; }
    .stat-icon.purple { background: #F5F3FF; color: #7C3AED; }
    .stat-icon.orange { background: #FFF7ED; color: #EA580C; }
    
    .stat-content .label { display: block; font-size: 0.85rem; font-weight: 600; color: #6B7280; }
    .stat-content .value { display: block; font-size: 1.5rem; font-weight: 800; color: #111827; }

    .table-card { background: white; border-radius: 28px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); overflow: hidden; }
    .table-actions { padding: 1.5rem 2rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    
    .search-box {
      position: relative;
      width: 100%;
      max-width: 400px;
    }
    .search-box svg { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #9CA3AF; }
    .search-box input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 3.25rem;
      border-radius: 14px;
      border: 2px solid #F3F4F6;
      background: #F9FAFB;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .search-box input:focus { outline: none; border-color: #FF7043; background: white; box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.08); }

    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1.25rem 2rem; font-size: 0.8rem; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #F3F4F6; }
    td { padding: 1.25rem 2rem; border-bottom: 1px solid #F3F4F6; font-size: 0.95rem; }
    
    tr:hover td { background: #FAFAFB; }

    .user-cell { display: flex; align-items: center; gap: 1rem; }
    .avatar { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1rem; flex-shrink: 0; }
    .avatar-image { width: 44px; height: 44px; border-radius: 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .avatar-image img { width: 100%; height: 100%; object-fit: cover; }
    .user-info { display: flex; flex-direction: column; }
    .user-info .name { font-weight: 700; color: #111827; }
    .user-info .since { font-size: 0.75rem; color: #9CA3AF; }

    .contact-cell { display: flex; flex-direction: column; }
    .contact-cell .phone { font-weight: 600; color: #374151; }
    .contact-cell .email { font-size: 0.85rem; color: #6B7280; }

    .orders-badge { background: #EEF2FF; color: #4F46E5; padding: 4px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: inline-block; }
    .spent-value { font-weight: 800; color: #FF7043; font-size: 1rem; }
    .visit-date { color: #6B7280; font-weight: 500; }

    .action-group { display: flex; justify-content: flex-end; gap: 0.5rem; }
    .action-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid #F3F4F6; background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #4B5563; }
    .action-btn svg { width: 18px; height: 18px; }
    .action-btn.edit:hover { background: #EEF2FF; color: #4F46E5; border-color: #E0E7FF; }
    .action-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    .empty-state { padding: 4rem 2rem; text-align: center; color: #6B7280; }
    .empty-icon { width: 64px; height: 64px; background: #F9FAFB; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #D1D5DB; }
    .empty-icon svg { width: 32px; height: 32px; }
    .empty-state h3 { font-size: 1.25rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem; }

    /* Modal Styles */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-content { background: white; border-radius: 32px; width: 100%; max-width: 600px; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.25); overflow: hidden; animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes modalSlide { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .modal-header { padding: 2rem 2.5rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.75rem; font-weight: 800; margin: 0; color: #111827; }
    .close-btn { background: #F3F4F6; border: none; width: 40px; height: 40px; border-radius: 12px; font-size: 1.5rem; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .modal-body { padding: 2.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.95rem; font-weight: 700; color: #374151; }
    .form-group input, .form-group textarea { padding: 0.9rem 1.25rem; border-radius: 16px; border: 2px solid #F3F4F6; background: #F9FAFB; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; background: white; border-color: #FF7043; box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1); }
    .modal-footer { padding: 2rem 2.5rem; background: #F9FAFB; display: flex; justify-content: flex-end; gap: 1.25rem; }
    .btn-ghost { background: white; border: 2px solid #F3F4F6; height: 52px; padding: 0 2rem; border-radius: 16px; font-weight: 700; cursor: pointer; color: #6B7280; }

    .image-upload-wrapper { display: flex; flex-direction: column; gap: 1rem; }
    .image-preview { position: relative; width: 100px; height: 100px; border-radius: 16px; overflow: hidden; }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    .remove-image { position: absolute; top: -10px; right: -10px; width: 32px; height: 32px; border-radius: 50%; background: #EF4444; color: white; border: none; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .image-upload-input { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-radius: 16px; border: 2px dashed #FF7043; background: #FFF7ED; cursor: pointer; transition: all 0.2s; color: #EA580C; font-weight: 600; }
    .image-upload-input:hover { background: #FFE8D6; }
    .image-upload-input svg { width: 24px; height: 24px; }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  editId: number | null = null;
  isSaving: boolean = false;
  imagePreview: string | null = null;

  customerForm = {
    name: '',
    phone: '',
    email: '',
    address: '',
    imagePath: ''
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  filteredCustomers(): Customer[] {
    if (!this.searchTerm) return this.customers;
    const term = this.searchTerm.toLowerCase();
    return this.customers.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.email.toLowerCase().includes(term) || 
      c.phone.includes(term)
    );
  }

  getHighSpendersCount(): number {
    return this.customers.filter(c => c.totalSpent > 500).length;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#FF7043', '#7C3AED', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];
    const index = name.length % colors.length;
    return colors[index];
  }

  openAddModal() {
    this.editId = null;
    this.customerForm = { name: '', phone: '', email: '', address: '', imagePath: '' };
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(customer: Customer) {
    this.editId = customer.id;
    this.customerForm = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address || '',
      imagePath: customer.imagePath || ''
    };
    this.imagePreview = customer.imagePath || null;
    this.showModal = true;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.customerForm.imagePath = this.imagePreview;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.customerForm.imagePath = '';
  }

  saveCustomer() {
    this.isSaving = true;
    const obs = this.editId 
      ? this.customerService.updateCustomer(this.editId, this.customerForm)
      : this.customerService.createCustomer(this.customerForm);

    obs.subscribe({
      next: () => {
        this.loadCustomers();
        this.showModal = false;
        this.isSaving = false;
      },
      error: () => this.isSaving = false
    });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
    }
  }
}
