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
        <div class="item-header">
          <img [src]="getImageUrl(item.imagePath)" 
               [alt]="item.name"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          
          <div class="header-overlay">
            <div class="status-dot" [class.available]="item.available"></div>
            <div class="price-badge">\$ {{ item.price }}</div>
            <div class="category-tag">{{ item.categoryName }}</div>
          </div>
        </div>
        
        <div class="item-body">
          <div class="item-info">
            <div class="title-row">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="rating">
                <span class="star">★</span>
                <span>4.8</span>
              </div>
            </div>
            <p class="description">{{ item.description }}</p>
          </div>
          
          <div class="item-actions">
            <button class="action-btn edit" (click)="openEditModal(item)" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="action-btn delete" (click)="deleteItem(item.id)" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal (Remains same structure but uses refined styles) -->
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

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
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
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(255, 112, 67, 0.35); }
    .btn-primary:active { transform: translateY(-1px); }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2.5rem;
    }

    .menu-item-card {
      background: white;
      border-radius: 28px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      position: relative;
    }
    .menu-item-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.12); }

    .item-header {
      height: 240px;
      margin: 12px;
      border-radius: 22px;
      position: relative;
      overflow: hidden;
      background: #F3F4F6;
    }
    .item-header img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    .menu-item-card:hover .item-header img { transform: scale(1.1); }

    .header-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.4) 100%);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      background: #D1D5DB;
      border-radius: 50%;
      border: 2px solid white;
      align-self: flex-end;
    }
    .status-dot.available { background: #10B981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }

    .price-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: white;
      color: #111827;
      padding: 6px 14px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .category-tag {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: white;
      padding: 6px 14px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      align-self: flex-start;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .item-body { padding: 0.5rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    
    .item-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .title-row { display: flex; justify-content: space-between; align-items: center; }
    .item-name { font-size: 1.35rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.01em; }
    
    .rating { display: flex; align-items: center; gap: 0.4rem; font-weight: 700; color: #F59E0B; font-size: 0.9rem; }
    .star { font-size: 1.1rem; }

    .description { font-size: 0.95rem; color: #6B7280; line-height: 1.6; height: 3rem; overflow: hidden; margin: 0; }

    .item-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
    
    .action-btn {
      flex: 1;
      height: 48px;
      border-radius: 16px;
      border: 1px solid #F3F4F6;
      background: #F9FAFB;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #4B5563;
    }
    .action-btn svg { width: 20px; height: 20px; }
    .action-btn.edit:hover { background: #EEF2FF; color: #4F46E5; border-color: #E0E7FF; }
    .action-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 32px;
      width: 100%;
      max-width: 640px;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalSlide {
      from { opacity: 0; transform: scale(0.9) translateY(40px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-header { padding: 2rem 2.5rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.75rem; font-weight: 800; margin: 0; color: #111827; }
    .close-btn { background: #F3F4F6; border: none; width: 40px; height: 40px; border-radius: 12px; font-size: 1.5rem; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .close-btn:hover { background: #E5E7EB; color: #111827; }

    .modal-body { padding: 2.5rem; max-height: 75vh; overflow-y: auto; }
    
    .image-upload-section { margin-bottom: 2.5rem; }
    .image-preview {
      width: 100%;
      height: 240px;
      background: #F9FAFB;
      border: 3px dashed #E5E7EB;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .image-preview:hover { border-color: #FF7043; background: #FFF7F5; }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    
    .image-preview::after {
      content: 'Change Image';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .image-preview:hover img + .image-preview::after { opacity: 1; }
    
    .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #9CA3AF; }
    .upload-placeholder svg { width: 48px; height: 48px; stroke-width: 1.5; }
    .upload-placeholder span { font-size: 1rem; font-weight: 600; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.95rem; font-weight: 700; color: #374151; }
    
    .form-group input, .form-group select, .form-group textarea {
      padding: 0.9rem 1.25rem;
      border-radius: 16px;
      border: 2px solid #F3F4F6;
      background: #F9FAFB;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.2s;
      color: #111827;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      background: white;
      border-color: #FF7043;
      box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1);
    }

    .checkbox-label { display: flex; align-items: center; gap: 0.8rem; cursor: pointer; font-weight: 700; font-size: 1rem; color: #374151; }
    .checkbox-label input { width: 22px; height: 22px; border-radius: 7px; cursor: pointer; accent-color: #FF7043; }

    .modal-footer { padding: 2rem 2.5rem; background: #F9FAFB; display: flex; justify-content: flex-end; align-items: center; gap: 1.25rem; }
    .btn-ghost { background: white; border: 2px solid #F3F4F6; height: 52px; padding: 0 2rem; border-radius: 16px; font-weight: 700; cursor: pointer; color: #6B7280; transition: all 0.2s; }
    .btn-ghost:hover { background: #F3F4F6; color: #111827; }

    .validation-hint { display: flex; gap: 1rem; font-size: 0.85rem; font-weight: 700; color: #EF4444; margin-right: auto; }
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

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/placeholder-food.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return 'http://localhost:9009' + imagePath;
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
      categoryId: item.categoryId
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
