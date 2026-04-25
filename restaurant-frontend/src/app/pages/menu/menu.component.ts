import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/common.service';
import { MenuItem } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="menu-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Menu Management</h1>
          <p class="subtitle">Organize and manage your restaurant's culinary offerings.</p>
        </div>
        <div class="header-actions">
        <button class="btn-primary" (click)="openAddModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Item
        </button>
      </div>
    </div>

    <!-- Menu Grid -->
    <div class="menu-grid">
      <div class="menu-item-card" *ngFor="let item of menuItems">
        <div class="status-indicator" [class.available]="item.available"></div>
        <div class="item-header">
          <img [src]="item.imagePath ? 'http://localhost:9009' + item.imagePath : 'assets/placeholder-food.jpg'" 
               [alt]="item.name"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="category-badge">
            {{ item.category.name }}
          </div>
          <div class="card-initials" *ngIf="!item.imagePath">{{ item.name | slice:0:2 | uppercase }}</div>
        </div>
        
        <div class="item-body">
          <div class="title-row">
            <h3 class="item-name">{{ item.name }}</h3>
            <span class="price">\$ {{ item.price }}</span>
          </div>
          <p class="description">{{ item.description }}</p>
          
          <div class="item-footer">
            <div class="actions">
              <button class="action-btn edit" (click)="openEditModal(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-btn delete" (click)="deleteItem(item.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editId ? 'Edit Menu Item' : 'Create New Menu Item' }}</h2>
          <button class="close-btn" (click)="showModal = false">×</button>
        </div>
        
        <div class="modal-body">
          <form #itemFormValid="ngForm" (ngSubmit)="saveItem()">
            <div class="image-upload-section">
              <div class="image-preview" (click)="fileInput.click()">
                <img *ngIf="previewUrl" [src]="previewUrl" alt="Preview">
                <div *ngIf="!previewUrl" class="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span>Click to upload image</span>
                </div>
              </div>
              <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" accept="image/*">
            </div>

            <div class="form-grid">
              <div class="form-group full">
                <label>Item Name</label>
                <input type="text" name="name" [(ngModel)]="itemForm.name" required placeholder="e.g. Grilled Salmon">
              </div>

              <div class="form-group">
                <label>Category</label>
                <select name="categoryId" [(ngModel)]="itemForm.categoryId" required #categorySelect="ngModel">
                  <option value="" disabled selected>Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Price ($)</label>
                <input type="number" name="price" [(ngModel)]="itemForm.price" required min="0.01" step="0.01">
              </div>

              <div class="form-group full">
                <label>Description</label>
                <textarea name="description" [(ngModel)]="itemForm.description" rows="3" placeholder="Describe the ingredients and taste..."></textarea>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" name="available" [(ngModel)]="itemForm.available">
                  <span>Available in Menu</span>
                </label>
              </div>
            </div>
            
            <div class="modal-footer">
              <div class="validation-hint" *ngIf="!itemFormValid.valid && !isSaving">
                <span *ngIf="!itemForm.name">● Name required</span>
                <span *ngIf="itemForm.price === null || itemForm.price <= 0">● Price > 0</span>
                <span *ngIf="!itemForm.categoryId">● Category required</span>
              </div>
              <button type="button" class="btn-ghost" (click)="showModal = false" [disabled]="isSaving">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!itemFormValid.valid || isSaving">
                <span *ngIf="isSaving">Saving...</span>
                <span *ngIf="!isSaving">{{ editId ? 'Update Item' : 'Save Item' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>`,
  styles: [`
    .menu-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.4s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-info h1 { font-size: 1.85rem; font-weight: 800; color: #111827; margin: 0; }
    .header-info .subtitle { color: #6B7280; font-size: 0.95rem; margin-top: 0.25rem; }

    .btn-primary {
      background: #FF7043;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      min-width: 140px;
      min-height: 48px;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 112, 67, 0.2);
      transition: all 0.2s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(255, 112, 67, 0.3); }
    .btn-primary:disabled {
      background: #D1D5DB;
      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.7;
    }
    .btn-primary svg { width: 18px; height: 18px; }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .menu-item-card {
      padding: 0;
      overflow: hidden;
      position: relative;
      border: 1px solid #E5E7EB;
      border-radius: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .menu-item-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }

    .status-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #D1D5DB;
      z-index: 10;
      border: 2px solid white;
    }
    .status-indicator.available { background: #10B981; }

    .item-header { position: relative; height: 200px; }
    .item-header img { width: 100%; height: 100%; object-fit: cover; }

    .category-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(255, 112, 67, 0.95);
      backdrop-filter: blur(4px);
      color: white;
      padding: 4px 14px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .item-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .item-body h3 { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0; }
    .price { font-weight: 800; font-size: 1.25rem; color: #FF7043; }

    .description { font-size: 0.9rem; color: #6B7280; line-height: 1.5; height: 2.7rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

    .item-footer { margin-top: 0.5rem; }
    .actions { display: flex; gap: 0.75rem; }

    .action-btn {
      flex: 1;
      height: 40px;
      border-radius: 10px;
      border: 1px solid #E5E7EB;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn svg { width: 18px; height: 18px; }
    .action-btn.edit:hover { background: #F3F4F6; color: #111827; }
    .action-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: modalSlide 0.3s ease-out;
    }

    @keyframes modalSlide {
      from { opacity: 0; transform: scale(0.95) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
    .close-btn { background: none; border: none; font-size: 2rem; color: #9CA3AF; cursor: pointer; }

    .modal-body { padding: 2rem; max-height: 70vh; overflow-y: auto; }
    
    .image-upload-section { margin-bottom: 2rem; display: flex; justify-content: center; }
    .image-preview {
      width: 100%;
      height: 200px;
      background: #F9FAFB;
      border: 2px dashed #D1D5DB;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .image-preview:hover { 
      border-color: #FF7043; 
      background: #FFF7F5;
      transform: scale(1.01);
    }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    
    .image-preview::after {
      content: 'Click to Change';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .image-preview:hover img + .image-preview::after { opacity: 1; }
    
    .upload-placeholder { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 0.75rem; 
      color: #9CA3AF;
      pointer-events: none;
    }
    .upload-placeholder svg { width: 32px; height: 32px; }
    .upload-placeholder span { font-size: 0.9rem; font-weight: 500; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.9rem; font-weight: 600; color: #374151; }
    
    .form-group input, .form-group select, .form-group textarea {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      background: #F9FAFB;
      font-family: inherit;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      background: white;
      border-color: #FF7043;
      box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1);
    }

    .checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 600; font-size: 0.95rem; }
    .checkbox-label input { width: 20px; height: 20px; border-radius: 6px; cursor: pointer; }

    .modal-footer { padding: 1.5rem 2rem; background: #F9FAFB; display: flex; justify-content: flex-end; align-items: center; gap: 1rem; }
    .btn-ghost { background: none; border: 1px solid #E5E7EB; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .btn-ghost:hover { background: #F3F4F6; }

    .validation-hint {
      display: flex;
      gap: 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #EF4444;
      margin-right: auto;
    }
  `]
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: any[] = [];
  showModal = false;
  isSaving = false;
  editId: number | null = null;

  itemForm = {
    name: '',
    description: '',
    price: null as number | null,
    available: true,
    categoryId: '' as string | number
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.loadMenu();
    this.menuService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadMenu(): void {
    this.menuService.getMenuItems().subscribe({
      next: (data) => this.menuItems = data,
      error: (err) => console.error('Failed to load menu', err)
    });
  }

  openAddModal(): void {
    this.editId = null;
    this.resetForm();
    this.showModal = true;
    if (this.categories && this.categories.length > 0) {
      this.itemForm.categoryId = this.categories[0].id;
    }
  }

  openEditModal(item: MenuItem): void {
    this.editId = item.id;
    this.itemForm = {
      name: item.name,
      description: item.description,
      price: item.price,
      available: item.available,
      categoryId: item.category.id
    };
    this.previewUrl = item.imagePath ? 'http://localhost:9009' + item.imagePath : null;
    this.showModal = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  saveItem(): void {
    const errors = [];
    if (!this.itemForm.name || this.itemForm.name.trim().length === 0) errors.push('Valid Name');
    if (this.itemForm.price === null || this.itemForm.price <= 0) errors.push('Price (> 0)');
    if (!this.itemForm.categoryId || this.itemForm.categoryId === '') errors.push('Category Selection');

    if (errors.length > 0) {
      alert('Missing or Invalid: ' + errors.join(', '));
      return;
    }

    this.isSaving = true;
    const payload = {
      ...this.itemForm,
      categoryId: Number(this.itemForm.categoryId)
    };

    const request = this.editId
      ? this.menuService.updateMenuItem(this.editId, payload)
      : this.menuService.createMenuItem(payload);

    request.subscribe({
      next: (item: MenuItem) => {
        if (this.selectedFile) {
          this.menuService.uploadItemImage(item.id, this.selectedFile).subscribe({
            next: () => this.resetAndReload(),
            error: (err: any) => {
              console.error('Image upload failed', err);
              alert('Item saved, but image upload failed.');
              this.resetAndReload();
            }
          });
        } else {
          this.resetAndReload();
        }
      },
      error: (err: any) => {
        console.error('Failed to save item', err);
        const errorMsg = err.error?.message || 'Please check the inputs and try again.';
        alert('Failed to save item: ' + errorMsg);
        this.isSaving = false;
      }
    });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.deleteMenuItem(id).subscribe(() => this.loadMenu());
    }
  }

  resetForm(): void {
    this.itemForm = {
      name: '',
      description: '',
      price: null,
      available: true,
      categoryId: ''
    };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  resetAndReload(): void {
    this.showModal = false;
    this.isSaving = false;
    this.resetForm();
    this.loadMenu();
  }
}
