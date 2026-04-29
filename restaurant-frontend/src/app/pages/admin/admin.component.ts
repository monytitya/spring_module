import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../core/services/common.service';
import { Staff } from '../../core/models/restaurant.model';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Admin Management</h1>
          <p class="subtitle">Manage staff members, roles, and permissions.</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Admin
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search by name, email or phone..." [(ngModel)]="searchTerm">
        </div>
      </div>

      <!-- Admin Table View -->
      <div class="table-container">
        <table class="admin-table" *ngIf="filteredAdmins().length > 0">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let admin of filteredAdmins()" class="admin-row">
              <td class="photo-cell">
                <div class="photo-wrapper">
                  <img *ngIf="admin.imagePath" [src]="admin.imagePath" [alt]="admin.name" />
                  <div *ngIf="!admin.imagePath" class="avatar" [style.background]="getAvatarColor(admin.name)">
                    {{ getInitials(admin.name) }}
                  </div>
                </div>
              </td>
              <td class="name-cell">
                <span class="name-text">{{ admin.name }}</span>
              </td>
              <td class="email-cell">
                {{ admin.email }}
              </td>
              <td class="phone-cell">
                {{ admin.phone }}
              </td>
              <td class="role-cell">
                <span class="role-badge">{{ admin.roleName }}</span>
              </td>
              <td class="status-cell">
                <span class="status-chip" [class]="admin.status">
                  {{ admin.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="action-btn edit" (click)="openEditModal(admin)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="action-btn delete-img" *ngIf="admin.imagePath" (click)="deleteAdminImage(admin.id)" title="Delete Image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  </button>
                  <button class="action-btn delete" (click)="deleteAdmin(admin.id)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredAdmins().length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <h3>No admins found</h3>
          <p>Try adjusting your search or add a new admin member.</p>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editId ? 'Edit Admin' : 'Add New Admin' }}</h2>
          <button class="close-btn" (click)="showModal = false">×</button>
        </div>
        <form (ngSubmit)="saveAdmin()">
          <div class="modal-body">
            <div class="form-grid">
              <!-- Profile Image Section -->
              <div class="form-group full">
                <label>Admin Photo</label>
                <div class="image-upload-wrapper">
                  <div *ngIf="imagePreview" class="image-preview">
                    <img [src]="imagePreview" alt="Preview">
                    <button type="button" class="remove-image" (click)="removeImage()" title="Remove image" [disabled]="isUploadingImage">×</button>
                  </div>
                  <label class="image-upload-input" [class.has-image]="imagePreview" [class.disabled]="isUploadingImage">
                    <svg *ngIf="!isUploadingImage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <svg *ngIf="isUploadingImage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                    <span>{{ isUploadingImage ? 'Uploading...' : (imagePreview ? 'Change Photo' : 'Upload Photo') }}</span>
                    <input type="file" accept="image/*" (change)="onImageSelected($event)" hidden [disabled]="isUploadingImage">
                  </label>
                </div>
              </div>

              <div class="form-group full">
                <label>Full Name</label>
                <input type="text" name="name" [(ngModel)]="adminForm.name" required placeholder="e.g. John Doe">
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" [(ngModel)]="adminForm.email" required placeholder="e.g. admin@restaurant.com">
              </div>

              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" [(ngModel)]="adminForm.phone" required placeholder="e.g. 012-345-678">
              </div>

              <div class="form-group">
                <label>PIN Code</label>
                <input type="password" name="pinCode" [(ngModel)]="adminForm.pinCode" required maxlength="6" placeholder="6 digits">
              </div>

              <div class="form-group">
                <label>Role</label>
                <select name="roleId" [(ngModel)]="adminForm.roleId" required>
                  <option [value]="null" disabled>Select a role</option>
                  <option *ngFor="let role of roles" [value]="role.id">{{ role.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Status</label>
                <select name="status" [(ngModel)]="adminForm.status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" (click)="showModal = false" [disabled]="isSaving || isUploadingImage">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="isSaving || isUploadingImage">
              {{ isSaving || isUploadingImage ? 'Saving...' : (editId ? 'Update Admin' : 'Add Admin') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { display: flex; flex-direction: column; gap: 2rem; padding: 2rem; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .header-info h1 { font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0; }
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
    .search-box input:focus { outline: none; border-color: #FF7043; background: white; box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.08); }

    /* Table Styles */
    .table-container { background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); overflow: hidden; }
    .admin-table { width: 100%; border-collapse: collapse; }
    
    .admin-table thead { background: #F9FAFB; border-bottom: 2px solid #E5E7EB; }
    .admin-table th {
      padding: 1.25rem;
      text-align: left;
      font-weight: 700;
      color: #374151;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .admin-table tbody tr { border-bottom: 1px solid #E5E7EB; transition: all 0.2s; }
    .admin-table tbody tr:hover { background: #F9FAFB; }
    .admin-table tbody tr:last-child { border-bottom: none; }
    
    .admin-table td { padding: 1rem 1.25rem; color: #374151; font-size: 0.95rem; }
    
    .photo-cell { width: 60px; }
    .photo-wrapper { width: 50px; height: 50px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .photo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .avatar { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; }
    
    .name-cell { font-weight: 600; color: #111827; }
    .name-text { display: block; }
    
    .email-cell { color: #6B7280; }
    .phone-cell { color: #6B7280; }
    
    .role-cell { text-align: center; }
    .role-badge { display: inline-block; background: #FF7043; color: white; padding: 0.4rem 0.8rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; }
    
    .status-cell { text-align: center; }
    .status-chip {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: capitalize;
    }
    .status-chip.active { background: #D1FAE5; color: #047857; }
    .status-chip.inactive { background: #FEE2E2; color: #DC2626; }
    
    .actions-cell { text-align: right; width: 150px; }
    .action-buttons { display: flex; gap: 0.6rem; justify-content: flex-end; }
    .action-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #F3F4F6; background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #4B5563; }
    .action-btn svg { width: 16px; height: 16px; }
    .action-btn:hover { transform: scale(1.1); }
    .action-btn.edit:hover { background: #EEF2FF; color: #4F46E5; border-color: #E0E7FF; }
    .action-btn.delete-img:hover { background: #FEF3E2; color: #F59E0B; border-color: #FED7AA; }
    .action-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    .empty-state { text-align: center; padding: 4rem 2rem; color: #6B7280; }
    .empty-state svg { width: 80px; height: 80px; color: #D1D5DB; margin-bottom: 1rem; }
    .empty-state h3 { font-size: 1.25rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem; }

    /* Modal Styles */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-content { background: white; border-radius: 32px; width: 100%; max-width: 700px; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.25); overflow: hidden; animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes modalSlide { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .modal-header { padding: 2rem 2.5rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.75rem; font-weight: 800; margin: 0; color: #111827; }
    .close-btn { background: #F3F4F6; border: none; width: 40px; height: 40px; border-radius: 12px; font-size: 1.5rem; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .modal-body { padding: 2.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.95rem; font-weight: 700; color: #374151; }
    .form-group input, .form-group select { padding: 0.9rem 1.25rem; border-radius: 16px; border: 2px solid #F3F4F6; background: #F9FAFB; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
    .form-group input:focus, .form-group select:focus { outline: none; background: white; border-color: #FF7043; box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1); }

    .image-upload-wrapper { display: flex; flex-direction: column; gap: 1rem; }
    .image-preview { position: relative; width: 120px; height: 120px; border-radius: 20px; overflow: hidden; }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    .remove-image { position: absolute; top: -10px; right: -10px; width: 36px; height: 36px; border-radius: 50%; background: #EF4444; color: white; border: none; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .image-upload-input { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-radius: 16px; border: 2px dashed #FF7043; background: #FFF7ED; cursor: pointer; transition: all 0.2s; color: #EA580C; font-weight: 600; }
    .image-upload-input:hover { background: #FFE8D6; }
    .image-upload-input svg { width: 24px; height: 24px; }

    .modal-footer { padding: 2rem 2.5rem; background: #F9FAFB; display: flex; justify-content: flex-end; gap: 1.25rem; }
    .btn-ghost { background: white; border: 2px solid #F3F4F6; height: 52px; padding: 0 2rem; border-radius: 16px; font-weight: 700; cursor: pointer; color: #6B7280; transition: all 0.2s; }
    .btn-ghost:hover { border-color: #FF7043; color: #FF7043; }
    
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .image-upload-input.disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AdminComponent implements OnInit {
  admins: Staff[] = [];
  roles: any[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  editId: number | null = null;
  isSaving: boolean = false;
  isUploadingImage: boolean = false;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  adminForm = {
    name: '',
    email: '',
    phone: '',
    pinCode: '',
    roleId: null as any,
    status: 'active',
    imagePath: ''
  };

  constructor(
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadRoles();
  }

  loadAdmins(): void {
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.admins = data;
      },
      error: (err) => console.error('Error loading admins:', err)
    });
  }

  loadRoles(): void {
 
    this.roles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Manager' },
      { id: 3, name: 'Staff' },
      { id: 4, name: 'Chef' }
    ];
  }

  filteredAdmins(): Staff[] {
    if (!this.searchTerm) return this.admins;
    const term = this.searchTerm.toLowerCase();
    return this.admins.filter(a =>
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.phone.includes(term)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#FF7043', '#7C3AED', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];
    const index = name.length % colors.length;
    return colors[index];
  }

  openAddModal(): void {
    this.editId = null;
    this.adminForm = { name: '', email: '', phone: '', pinCode: '', roleId: null, status: 'active', imagePath: '' };
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.showModal = true;
  }

  openEditModal(admin: Staff): void {
    this.editId = admin.id;
    this.adminForm = {
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      pinCode: admin.pinCode,
      roleId: admin.roleId,
      status: admin.status,
      imagePath: admin.imagePath || ''
    };
    this.imagePreview = admin.imagePath || null;
    this.selectedImageFile = null;
    this.showModal = true;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

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
    this.adminForm.imagePath = '';
  }

  private uploadImage(staffId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.selectedImageFile) {
        resolve();
        return;
      }

      this.isUploadingImage = true;
      this.staffService.uploadStaffImage(staffId, this.selectedImageFile).subscribe({
        next: (response) => {
          this.isUploadingImage = false;
          this.selectedImageFile = null;
          this.adminForm.imagePath = response.imagePath || '';
          resolve();
        },
        error: (err) => {
          this.isUploadingImage = false;
          console.error('Error uploading image:', err);
          alert('Error uploading image: ' + (err.error?.message || err.message));
          reject(err);
        }
      });
    });
  }

  saveAdmin(): void {
    if (!this.adminForm.name || !this.adminForm.email || !this.adminForm.phone || !this.adminForm.pinCode || !this.adminForm.roleId) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    const staffData = { ...this.adminForm, imagePath: undefined };
    const obs = this.editId
      ? this.staffService.updateStaff(this.editId, staffData)
      : this.staffService.createStaff(staffData);

    obs.subscribe({
      next: async (response) => {
        try {
          // Upload image if selected
          if (this.selectedImageFile && response.id) {
            await this.uploadImage(response.id);
          }
          this.isSaving = false;
          this.loadAdmins();
          this.showModal = false;
          alert('Admin saved successfully!');
        } catch (err) {
          this.isSaving = false;
          this.loadAdmins();
          this.showModal = false;
          alert('Admin saved but image upload failed');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving admin:', err);
        alert('Error saving admin: ' + (err.error?.message || err.message));
      }
    });
  }

  deleteAdmin(id: number): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          this.loadAdmins();
          alert('Admin deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting admin:', err);
          alert('Error deleting admin: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  deleteAdminImage(adminId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.isUploadingImage = true;
      this.staffService.deleteStaffImage(adminId).subscribe({
        next: () => {
          this.isUploadingImage = false;
          this.loadAdmins();
          alert('Image deleted successfully');
        },
        error: (err) => {
          this.isUploadingImage = false;
          console.error('Error deleting image:', err);
          alert('Error deleting image: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
