import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableService } from '../../core/services/common.service';
import { Table } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tables-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Floor Plan</h1>
          <p class="subtitle">Manage restaurant layout and table assignments.</p>
        </div>
        <div class="header-actions">
          <div class="legend">
            <div class="legend-item"><span class="dot available"></span> Available</div>
            <div class="legend-item"><span class="dot occupied"></span> Occupied</div>
          </div>
          <button class="btn-primary" (click)="openAddModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Table
          </button>
        </div>
      </div>

      <div class="table-grid">
        <div class="table-card card" *ngFor="let table of tables" [class.occupied]="table.status === 'occupied'">
          <div class="card-actions">
            <button class="icon-btn edit" (click)="openEditModal(table)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="icon-btn delete" (click)="deleteTable(table.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>

          <div class="table-info">
            <span class="table-number">{{ table.tableNumber }}</span>
            <span class="capacity">👤 {{ table.capacity }}</span>
          </div>

          <div class="table-display">
            <div class="custom-image" *ngIf="table.imagePath">
              <img [src]="'http://localhost:9009' + table.imagePath" alt="Table Image">
            </div>
            <div class="table-graphic" *ngIf="!table.imagePath">
              <div class="chair top"></div>
              <div class="chair bottom"></div>
              <div class="chair left"></div>
              <div class="chair right"></div>
              <div class="main-table"></div>
            </div>
          </div>
          
          <div class="status-text">{{ table.status }}</div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editId ? 'Edit Table' : 'Add New Table' }}</h2>
            <button class="close-btn" (click)="showModal = false">×</button>
          </div>
          
          <div class="modal-body">
            <form #tableFormValid="ngForm" (ngSubmit)="saveTable()">
              <div class="image-upload-section">
                <div class="image-preview" (click)="fileInput.click()">
                  <img *ngIf="previewUrl" [src]="previewUrl" alt="Preview">
                  <div *ngIf="!previewUrl" class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>Click to upload table image</span>
                  </div>
                </div>
                <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" accept="image/*">
              </div>

              <div class="form-grid">
                <div class="form-group full">
                  <label>Table Number</label>
                  <input type="text" name="tableNumber" [(ngModel)]="tableForm.tableNumber" required placeholder="e.g. T-10">
                </div>

                <div class="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" [(ngModel)]="tableForm.capacity" required min="1">
                </div>

                <div class="form-group">
                  <label>Status</label>
                  <select name="status" [(ngModel)]="tableForm.status">
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn-ghost" (click)="showModal = false" [disabled]="isSaving">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="!tableFormValid.valid || isSaving">
                  <span *ngIf="isSaving">Saving...</span>
                  <span *ngIf="!isSaving">{{ editId ? 'Update Table' : 'Save Table' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tables-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.4s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-info h1 { font-size: 1.85rem; font-weight: 800; color: #111827; margin: 0; }
    .header-info .subtitle { color: #6B7280; font-size: 0.95rem; margin-top: 0.25rem; }

    .header-actions { display: flex; align-items: center; gap: 1.5rem; }

    .btn-primary {
      background: #FF7043;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 112, 67, 0.2);
      transition: all 0.2s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(255, 112, 67, 0.3); }
    .btn-primary svg { width: 18px; height: 18px; }

    .legend { display: flex; gap: 1rem; background: white; padding: 0.5rem 1.25rem; border-radius: 50px; border: 1px solid #E5E7EB; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #4B5563; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.available { background: #10B981; }
    .dot.occupied { background: #EF4444; }

    .table-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 2rem;
    }

    .table-card {
      height: 260px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      border: 1px solid #E5E7EB;
      border-radius: 20px;
    }
    .table-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #FF7043; }
    .table-card.occupied { background: #FEF2F2; }

    .card-actions {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .table-card:hover .card-actions { opacity: 1; }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .icon-btn svg { width: 16px; height: 16px; }
    .icon-btn.edit:hover { background: #F3F4F6; color: #111827; }
    .icon-btn.delete:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }

    .table-info { display: flex; flex-direction: column; align-items: center; }
    .table-number { font-size: 1.5rem; font-weight: 800; color: #111827; }
    .capacity { font-size: 0.85rem; color: #6B7280; font-weight: 500; }

    .table-display {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .custom-image { width: 90px; height: 90px; border-radius: 16px; overflow: hidden; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .custom-image img { width: 100%; height: 100%; object-fit: cover; }

    .table-graphic {
      width: 80px;
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-table { width: 50px; height: 50px; background: white; border: 3px solid #CBD5E0; border-radius: 12px; z-index: 2; }
    .occupied .main-table { border-color: #EF4444; }

    .chair { width: 15px; height: 15px; background: #E2E8F0; border-radius: 4px; position: absolute; }
    .occupied .chair { background: #FCA5A5; }

    .top { top: 0; left: 50%; transform: translateX(-50%); }
    .bottom { bottom: 0; left: 50%; transform: translateX(-50%); }
    .left { left: 0; top: 50%; transform: translateY(-50%); }
    .right { right: 0; top: 50%; transform: translateY(-50%); }

    .status-text {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 800;
      color: #10B981;
      letter-spacing: 0.5px;
    }
    .occupied .status-text { color: #EF4444; }

    /* Modal Styles (Synced with MenuComponent) */
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
      max-width: 500px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
    .close-btn { background: none; border: none; font-size: 2rem; color: #9CA3AF; cursor: pointer; }

    .modal-body { padding: 2rem; }
    
    .image-upload-section { margin-bottom: 2rem; display: flex; justify-content: center; }
    .image-preview {
      width: 100%;
      height: 180px;
      background: #F9FAFB;
      border: 2px dashed #D1D5DB;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    .image-preview:hover { border-color: #FF7043; background: #FFF7F5; }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    
    .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: #9CA3AF; }
    .upload-placeholder svg { width: 32px; height: 32px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 0.9rem; font-weight: 600; color: #374151; }
    
    .form-group input, .form-group select {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      background: #F9FAFB;
      font-size: 0.95rem;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #FF7043;
      box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1);
    }

    .modal-footer { padding-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-ghost { background: none; border: 1px solid #E5E7EB; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; }
  `]
})
export class TablesComponent implements OnInit {
  tables: Table[] = [];
  showModal = false;
  isSaving = false;
  editId: number | null = null;

  tableForm = {
    tableNumber: '',
    capacity: 4,
    status: 'available' as 'available' | 'occupied'
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.tableService.getTables().subscribe(data => this.tables = data);
  }

  openAddModal(): void {
    this.editId = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(table: Table): void {
    this.editId = table.id;
    this.tableForm = {
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      status: table.status
    };
    this.previewUrl = table.imagePath ? 'http://localhost:9009' + table.imagePath : null;
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

  saveTable(): void {
    this.isSaving = true;
    const request = this.editId
      ? this.tableService.updateTable(this.editId, this.tableForm)
      : this.tableService.createTable(this.tableForm);

    request.subscribe({
      next: (table) => {
        if (this.selectedFile) {
          this.tableService.uploadTableImage(table.id, this.selectedFile).subscribe({
            next: () => this.resetAndReload(),
            error: (err) => {
              console.error('Table image upload failed', err);
              this.resetAndReload();
            }
          });
        } else {
          this.resetAndReload();
        }
      },
      error: (err) => {
        console.error('Failed to save table', err);
        this.isSaving = false;
      }
    });
  }

  deleteTable(id: number): void {
    if (confirm('Are you sure you want to delete this table?')) {
      this.tableService.deleteTable(id).subscribe(() => this.loadTables());
    }
  }

  resetForm(): void {
    this.tableForm = { tableNumber: '', capacity: 4, status: 'available' };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  resetAndReload(): void {
    this.showModal = false;
    this.isSaving = false;
    this.resetForm();
    this.loadTables();
  }
}
