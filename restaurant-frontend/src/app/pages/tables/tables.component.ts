import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../core/services/common.service';
import { Table } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tables-container">
      <div class="page-header">
        <h1>Floor Plan</h1>
        <div class="legend">
          <div class="legend-item"><span class="dot available"></span> Available</div>
          <div class="legend-item"><span class="dot occupied"></span> Occupied</div>
        </div>
      </div>

      <div class="table-grid">
        <div class="table-card card" *ngFor="let table of tables" [class.occupied]="table.status === 'occupied'">
          <div class="table-info">
            <span class="table-number">{{ table.tableNumber }}</span>
            <span class="capacity">👤 {{ table.capacity }}</span>
          </div>
          <div class="table-graphic">
            <div class="chair top"></div>
            <div class="chair bottom"></div>
            <div class="chair left"></div>
            <div class="chair right"></div>
            <div class="main-table"></div>
          </div>
          <div class="status-text">{{ table.status }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tables-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }

    .legend { display: flex; gap: 1.5rem; background: white; padding: 0.5rem 1rem; border-radius: 50px; border: 1px solid var(--border); }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.available { background: #10B981; }
    .dot.occupied { background: #EF4444; }

    .table-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
      margin-top: 1rem;
    }

    .table-card {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transition: all 0.2s;
      cursor: pointer;
    }
    .table-card:hover { transform: scale(1.05); }
    .table-card.occupied { border-color: rgba(239, 68, 68, 0.2); background: #FEF2F2; }

    .table-info { display: flex; flex-direction: column; align-items: center; }
    .table-number { font-size: 1.5rem; font-weight: 800; }
    .capacity { font-size: 0.75rem; color: var(--text-secondary); }

    .table-graphic {
      width: 80px;
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-table {
      width: 50px;
      height: 50px;
      background: white;
      border: 3px solid #CBD5E0;
      border-radius: 12px;
      z-index: 2;
    }
    .occupied .main-table { border-color: #EF4444; }

    .chair {
      width: 15px;
      height: 15px;
      background: #E2E8F0;
      border-radius: 4px;
      position: absolute;
    }
    .occupied .chair { background: #FCA5A5; }

    .top { top: 0; left: 50%; transform: translateX(-50%); }
    .bottom { bottom: 0; left: 50%; transform: translateX(-50%); }
    .left { left: 0; top: 50%; transform: translateY(-50%); }
    .right { right: 0; top: 50%; transform: translateY(-50%); }

    .status-text {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #10B981;
    }
    .occupied .status-text { color: #EF4444; }
  `]
})
export class TablesComponent implements OnInit {
  tables: Table[] = [];

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.tableService.getTables().subscribe(data => this.tables = data);
  }
}
