import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../core/services/setting.service';
import { Setting } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <div class="header-info">
          <h1>System Settings</h1>
          <p class="subtitle">Configure application behavior, including user login and registration.</p>
        </div>
      </div>

      <div class="settings-grid">
        <div class="settings-card">
          <div class="card-header">
            <h3>Auth & Security Settings</h3>
            <p>Manage how users login and register in the system.</p>
          </div>
          
          <div class="table-container">
            <table class="settings-table">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let setting of authSettings" class="setting-row">
                  <td class="key-cell">{{ formatKey(setting.key) }}</td>
                  <td class="value-cell">
                    <ng-container [ngSwitch]="getInputType(setting.key)">
                      <div *ngSwitchCase="'boolean'" class="toggle-wrapper">
                        <label class="switch">
                          <input type="checkbox" [checked]="setting.value === 'true'" (change)="toggleBoolean(setting)">
                          <span class="slider round"></span>
                        </label>
                        <span class="status-label">{{ setting.value === 'true' ? 'Enabled' : 'Disabled' }}</span>
                      </div>
                      <div *ngSwitchCase="'select'" class="select-wrapper">
                        <select [(ngModel)]="setting.value" (change)="saveSetting(setting)">
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>
                      <div *ngSwitchDefault class="input-wrapper">
                        <input type="text" [(ngModel)]="setting.value" (blur)="saveSetting(setting)">
                      </div>
                    </ng-container>
                  </td>
                  <td class="desc-cell">{{ setting.description }}</td>
                  <td class="actions-cell">
                    <button class="save-btn" (click)="saveSetting(setting)" [disabled]="loadingId === setting.id">
                      {{ loadingId === setting.id ? '...' : 'Save' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="settings-card">
          <div class="card-header">
            <h3>General Settings</h3>
            <p>Global application configurations.</p>
          </div>
          <div class="table-container">
            <table class="settings-table">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let setting of generalSettings" class="setting-row">
                  <td class="key-cell">{{ formatKey(setting.key) }}</td>
                  <td class="value-cell">
                    <input type="text" [(ngModel)]="setting.value" (blur)="saveSetting(setting)">
                  </td>
                  <td class="desc-cell">{{ setting.description }}</td>
                  <td class="actions-cell">
                    <button class="save-btn" (click)="saveSetting(setting)" [disabled]="loadingId === setting.id">
                      {{ loadingId === setting.id ? '...' : 'Save' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="settings-card payment-card">
          <div class="card-header">
            <h3>Payment Configuration</h3>
            <p>Setup your payment gateway and security tokens.</p>
          </div>
          <div class="table-container">
            <table class="settings-table">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let setting of paymentSettings" class="setting-row">
                  <td class="key-cell">{{ formatKey(setting.key) }}</td>
                  <td class="value-cell">
                    <div class="input-wrapper">
                      <input [type]="setting.key.includes('token') ? 'password' : 'text'" 
                             [(ngModel)]="setting.value" 
                             (blur)="saveSetting(setting)"
                             placeholder="Enter token here...">
                    </div>
                  </td>
                  <td class="desc-cell">{{ setting.description }}</td>
                  <td class="actions-cell">
                    <button class="save-btn" (click)="saveSetting(setting)" [disabled]="loadingId === setting.id">
                      {{ loadingId === setting.id ? '...' : 'Save' }}
                    </button>
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
    .settings-container { display: flex; flex-direction: column; gap: 2rem; padding: 2rem; animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { margin-bottom: 1rem; }
    .header-info h1 { font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0; }
    .header-info .subtitle { color: #6B7280; font-size: 1rem; margin-top: 0.4rem; }

    .settings-grid { display: flex; flex-direction: column; gap: 2.5rem; }
    
    .settings-card { 
      background: white; 
      border-radius: 24px; 
      padding: 2rem; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.04); 
      border: 1px solid #F3F4F6;
    }

    .card-header { margin-bottom: 2rem; }
    .card-header h3 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
    .card-header p { color: #6B7280; margin-top: 0.5rem; }

    .table-container { overflow-x: auto; }
    .settings-table { width: 100%; border-collapse: collapse; }
    .settings-table th { text-align: left; padding: 1.25rem; border-bottom: 2px solid #F3F4F6; color: #374151; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .settings-table td { padding: 1.5rem 1.25rem; border-bottom: 1px solid #F3F4F6; color: #4B5563; }
    .setting-row:hover { background: #F9FAFB; }
    
    .key-cell { font-weight: 600; color: #111827; width: 250px; }
    .value-cell { width: 300px; }
    .desc-cell { font-size: 0.9rem; color: #6B7280; }
    
    input[type="text"], select {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 2px solid #F3F4F6;
      background: #F9FAFB;
      font-family: inherit;
      transition: all 0.2s;
    }
    input[type="text"]:focus, select:focus { outline: none; border-color: #FF7043; background: white; }

    .save-btn {
      background: #F3F4F6;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 10px;
      font-weight: 700;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
    }
    .save-btn:hover:not(:disabled) { background: #FF7043; color: white; }
    .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Switch Style */
    .toggle-wrapper { display: flex; align-items: center; gap: 1rem; }
    .switch { position: relative; display: inline-block; width: 48px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; inset: 0; background-color: #D1D5DB; transition: .4s; border-radius: 24px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: #FF7043; }
    input:checked + .slider:before { transform: translateX(24px); }
    .status-label { font-size: 0.85rem; font-weight: 600; color: #6B7280; }

    .payment-card { border-left: 4px solid #FF7043; background: linear-gradient(to right, #FFFFFF, #FFFBF9); }
    .payment-card .key-cell { color: #C2410C; }
  `]
})
export class SettingsComponent implements OnInit {
  settings: Setting[] = [];
  authSettings: Setting[] = [];
  generalSettings: Setting[] = [];
  paymentSettings: Setting[] = [];
  loadingId: number | null = null;

  constructor(private settingService: SettingService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingService.getAllSettings().subscribe(data => {
      this.settings = data;
      this.authSettings = data.filter(s => s.group === 'auth');
      this.generalSettings = data.filter(s => s.group === 'general');
      this.paymentSettings = data.filter(s => s.group === 'payment');
    });
  }

  formatKey(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getInputType(key: string): string {
    if (key.includes('allow') || key.includes('require')) return 'boolean';
    if (key.includes('role')) return 'select';
    return 'text';
  }

  toggleBoolean(setting: Setting): void {
    setting.value = setting.value === 'true' ? 'false' : 'true';
    this.saveSetting(setting);
  }

  saveSetting(setting: Setting): void {
    if (!setting.id) return;
    this.loadingId = setting.id;
    this.settingService.updateSetting(setting.id, setting).subscribe({
      next: () => {
        this.loadingId = null;
      },
      error: (err) => {
        this.loadingId = null;
        console.error('Error saving setting:', err);
        alert('Failed to save setting');
      }
    });
  }
}
