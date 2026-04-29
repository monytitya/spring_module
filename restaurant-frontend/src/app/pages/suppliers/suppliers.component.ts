import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../core/services/common.service';
import { Supplier } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="suppliers-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Supplier Management</h1>
          <p class="subtitle">Manage your restaurant's supply chain and vendors.</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Supplier
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search by name, category or contact..." [(ngModel)]="searchTerm">
        </div>
      </div>

      <!-- Suppliers Table View -->
      <div class="table-container">
        <table class="supplier-table" *ngIf="filteredSuppliers().length > 0">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Supplier Name</th>
              <th>Contact Person</th>
              <th>Category</th>
              <th>Phone / Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supplier of filteredSuppliers()" class="supplier-row">
              <td class="photo-cell">
                <div class="photo-wrapper">
                  <img *ngIf="supplier.imagePath" [src]="supplier.imagePath" [alt]="supplier.name" />
                  <div *ngIf="!supplier.imagePath" class="avatar" [style.background]="getAvatarColor(supplier.name)">
                    {{ getInitials(supplier.name) }}
                  </div>
                </div>
              </td>
              <td class="name-cell">
                <span class="name-text">{{ supplier.name }}</span>
                <span class="created-at">Since {{ supplier.createdAt | date:'MMM yyyy' }}</span>
              </td>
              <td class="contact-cell">
                {{ supplier.contactName || 'N/A' }}
              </td>
              <td class="category-cell">
                <span class="category-badge">{{ supplier.category || 'General' }}</span>
              </td>
              <td class="info-cell">
                <div class="info-wrapper">
                  <span>{{ supplier.phone }}</span>
                  <span class="email-small">{{ supplier.email }}</span>
                </div>
              </td>
              <td class="status-cell">
                <span class="status-chip" [class]="supplier.status">
                  {{ supplier.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="action-btn edit" (click)="openEditModal(supplier)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="action-btn delete" (click)="deleteSupplier(supplier.id)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredSuppliers().length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          <h3>No suppliers found</h3>
          <p>Try adjusting your search or add a new supplier partner.</p>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editId ? 'Edit Supplier' : 'Add New Supplier' }}</h2>
          <button class="close-btn" (click)="showModal = false">×</button>
        </div>
        <form (ngSubmit)="saveSupplier()">
          <div class="modal-body">
            <div class="form-grid">
              <!-- Logo Section -->
              <div class="form-group full">
                <label>Supplier Logo</label>
                <div class="image-upload-wrapper">
                  <div *ngIf="imagePreview" class="image-preview">
                    <img [src]="imagePreview" alt="Preview">
                    <button type="button" class="remove-image" (click)="removeImage()" title="Remove image" [disabled]="isUploadingImage">×</button>
                  </div>
                  <label class="image-upload-input" [class.has-image]="imagePreview" [class.disabled]="isUploadingImage">
                    <svg *ngIf="!isUploadingImage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <svg *ngIf="isUploadingImage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                    <span>{{ isUploadingImage ? 'Uploading...' : (imagePreview ? 'Change Logo' : 'Upload Logo') }}</span>
                    <input type="file" accept="image/*" (change)="onImageSelected($event)" hidden [disabled]="isUploadingImage">
                  </label>
                </div>
              </div>

              <div class="form-group full">
                <label>Company Name</label>
                <input type="text" name="name" [(ngModel)]="supplierForm.name" required placeholder="e.g. Fresh Foods Ltd">
              </div>

              <div class="form-group">
                <label>Contact Person</label>
                <input type="text" name="contactName" [(ngModel)]="supplierForm.contactName" placeholder="e.g. John Smith">
              </div>

              <div class="form-group">
                <label>Category</label>
                <select name="category" [(ngModel)]="supplierForm.category">
                  <option value="Meat">Meat & Poultry</option>
                  <option value="Vegetables">Vegetables & Fruits</option>
                  <option value="Drinks">Beverages</option>
                  <option value="Dry">Dry Goods</option>
                  <option value="Equipment">Kitchen Equipment</option>
                  <option value="General">General Supply</option>
                </select>
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" [(ngModel)]="supplierForm.email" required placeholder="e.g. sales@vendor.com">
              </div>

              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" [(ngModel)]="supplierForm.phone" required placeholder="e.g. 012-345-678">
              </div>

              <div class="form-group full">
                <label>Address</label>
                <textarea name="address" [(ngModel)]="supplierForm.address" rows="2" placeholder="Street, City..."></textarea>
              </div>

              <div class="form-group">
                <label>Status</label>
                <select name="status" [(ngModel)]="supplierForm.status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" (click)="showModal = false" [disabled]="isSaving || isUploadingImage">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="isSaving || isUploadingImage">
              {{ isSaving || isUploadingImage ? 'Saving...' : (editId ? 'Update Supplier' : 'Add Supplier') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .suppliers-container { display: flex; flex-direction: column; gap: 2rem; padding: 2rem; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .header-info h1 { font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0; }
    .header-info .subtitle { color: #6B7280; font-size: 1rem; margin-top: 0.4rem; }

    .btn-primary {
      background: #4F46E5;
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
      box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
      transition: all 0.3s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(79, 70, 229, 0.35); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .search-section { display: flex; justify-content: center; margin-bottom: 1.5rem; }
    .search-box {
      position: relative;
      width: 100%;
      max-width: 500px;
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
    .search-box input:focus { outline: none; border-color: #4F46E5; background: white; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08); }

    /* Table Styles */
    .table-container { background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); overflow: hidden; }
    .supplier-table { width: 100%; border-collapse: collapse; }
    
    .supplier-table thead { background: #F9FAFB; border-bottom: 1px solid #E5E7EB; }
    .supplier-table th {
      padding: 1.25rem;
      text-align: left;
      font-weight: 700;
      color: #374151;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .supplier-table tbody tr { border-bottom: 1px solid #F3F4F6; transition: all 0.2s; }
    .supplier-table tbody tr:hover { background: #F9FAFB; }
    .supplier-table tbody tr:last-child { border-bottom: none; }
    
    .supplier-table td { padding: 1rem 1.25rem; color: #374151; font-size: 0.95rem; }
    
    .photo-cell { width: 70px; }
    .photo-wrapper { width: 48px; height: 48px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .photo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .avatar { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; }
    
    .name-cell { display: flex; flex-direction: column; }
    .name-text { font-weight: 700; color: #111827; }
    .created-at { font-size: 0.75rem; color: #9CA3AF; margin-top: 2px; }
    
    .category-badge { display: inline-block; background: #EEF2FF; color: #4F46E5; padding: 0.3rem 0.7rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; }
    
    .info-wrapper { display: flex; flex-direction: column; }
    .email-small { font-size: 0.8rem; color: #6B7280; }
    
    .status-chip {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: capitalize;
    }
    .status-chip.active { background: #D1FAE5; color: #065F46; }
    .status-chip.inactive { background: #FEE2E2; color: #991B1B; }
    
    .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #F3F4F6; background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #4B5563; }
    .action-btn svg { width: 16px; height: 16px; }
    .action-btn.edit:hover { background: #EEF2FF; color: #4F46E5; border-color: #E0E7FF; }
    .action-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    .empty-state { text-align: center; padding: 4rem 2rem; color: #6B7280; }
    .empty-state svg { width: 64px; height: 64px; color: #D1D5DB; margin-bottom: 1.5rem; }
    .empty-state h3 { font-size: 1.25rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem; }

    /* Modal Styles */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-content { background: white; border-radius: 32px; width: 100%; max-width: 650px; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.25); overflow: hidden; animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes modalSlide { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .modal-header { padding: 1.5rem 2.5rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; color: #111827; }
    .close-btn { background: #F3F4F6; border: none; width: 36px; height: 36px; border-radius: 10px; font-size: 1.25rem; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .modal-body { padding: 2rem 2.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.9rem; font-weight: 700; color: #374151; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.85rem 1.1rem; border-radius: 14px; border: 2px solid #F3F4F6; background: #F9FAFB; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; background: white; border-color: #4F46E5; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

    .image-upload-wrapper { display: flex; align-items: center; gap: 1.5rem; }
    .image-preview { position: relative; width: 80px; height: 80px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    .remove-image { position: absolute; top: -5px; right: -5px; width: 24px; height: 24px; border-radius: 50%; background: #EF4444; color: white; border: none; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .image-upload-input { flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 14px; border: 2px dashed #D1D5DB; background: #F9FAFB; cursor: pointer; transition: all 0.2s; color: #6B7280; font-weight: 600; font-size: 0.9rem; }
    .image-upload-input:hover { border-color: #4F46E5; color: #4F46E5; background: #EEF2FF; }
    .image-upload-input svg { width: 20px; height: 20px; }

    .modal-footer { padding: 1.5rem 2.5rem; background: #F9FAFB; display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-ghost { background: white; border: 2px solid #F3F4F6; height: 48px; padding: 0 1.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; color: #6B7280; transition: all 0.2s; }
    .btn-ghost:hover { border-color: #D1D5DB; color: #374151; }
    
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  editId: number | null = null;
  isSaving: boolean = false;
  isUploadingImage: boolean = false;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  supplierForm = {
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    category: 'General',
    status: 'active',
    imagePath: ''
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers = data,
      error: (err) => console.error('Error loading suppliers:', err)
    });
  }

  filteredSuppliers(): Supplier[] {
    if (!this.searchTerm) return this.suppliers;
    const term = this.searchTerm.toLowerCase();
    return this.suppliers.filter(s =>
      s.name.toLowerCase().includes(term) ||
      (s.contactName && s.contactName.toLowerCase().includes(term)) ||
      (s.category && s.category.toLowerCase().includes(term)) ||
      s.email.toLowerCase().includes(term) ||
      s.phone.includes(term)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#4F46E5', '#7C3AED', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];
    const index = name.length % colors.length;
    return colors[index];
  }

  openAddModal(): void {
    this.editId = null;
    this.supplierForm = { name: '', contactName: '', phone: '', email: '', address: '', category: 'General', status: 'active', imagePath: '' };
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.showModal = true;
  }

  openEditModal(supplier: Supplier): void {
    this.editId = supplier.id;
    this.supplierForm = {
      name: supplier.name,
      contactName: supplier.contactName || '',
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address || '',
      category: supplier.category || 'General',
      status: supplier.status,
      imagePath: supplier.imagePath || ''
    };
    this.imagePreview = supplier.imagePath || null;
    this.selectedImageFile = null;
    this.showModal = true;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.supplierForm.imagePath = '';
  }

  private uploadImage(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.selectedImageFile) {
        resolve();
        return;
      }
      this.isUploadingImage = true;
      this.supplierService.uploadSupplierImage(id, this.selectedImageFile).subscribe({
        next: (response) => {
          this.isUploadingImage = false;
          this.selectedImageFile = null;
          this.supplierForm.imagePath = response.imagePath || '';
          resolve();
        },
        error: (err) => {
          this.isUploadingImage = false;
          reject(err);
        }
      });
    });
  }

  saveSupplier(): void {
    if (!this.supplierForm.name || !this.supplierForm.email || !this.supplierForm.phone) {
      alert('Please fill in required fields');
      return;
    }

    this.isSaving = true;
    const obs = this.editId
      ? this.supplierService.updateSupplier(this.editId, this.supplierForm)
      : this.supplierService.createSupplier(this.supplierForm);

    obs.subscribe({
      next: async (response) => {
        try {
          if (this.selectedImageFile && response.id) {
            await this.uploadImage(response.id);
          }
          this.isSaving = false;
          this.loadSuppliers();
          this.showModal = false;
        } catch (err) {
          this.isSaving = false;
          this.loadSuppliers();
          this.showModal = false;
          alert('Supplier saved but logo upload failed');
        }
      },
      error: (err) => {
        this.isSaving = false;
        alert('Error saving supplier');
      }
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => this.loadSuppliers());
    }
  }
}
