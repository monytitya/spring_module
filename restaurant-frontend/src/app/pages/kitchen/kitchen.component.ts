import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kitchen-container">
      <div class="page-header">
        <h1>Kitchen Display System</h1>
        <div class="status-pills">
          <span class="pill active">Current Orders (12)</span>
          <span class="pill">Completed</span>
        </div>
      </div>

      <div class="kitchen-grid">
        <div class="ticket card" *ngFor="let i of [1,2,3,4]">
          <div class="ticket-header">
            <span class="table-num">T{{ i }}</span>
            <span class="time">12:35 PM</span>
          </div>
          <div class="ticket-items">
            <div class="item">
              <span class="qty">2</span>
              <span class="name">Beef Steak</span>
              <span class="note">Medium Rare</span>
            </div>
            <div class="item">
              <span class="qty">1</span>
              <span class="name">Caesar Salad</span>
            </div>
            <div class="item">
              <span class="qty">3</span>
              <span class="name">Coca Cola</span>
            </div>
          </div>
          <div class="ticket-footer">
            <button class="btn-prepare">Prepare</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kitchen-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }

    .status-pills { display: flex; gap: 0.5rem; }
    .pill { padding: 0.5rem 1.25rem; border-radius: 50px; background: white; border: 1px solid var(--border); font-size: 0.85rem; font-weight: 500; cursor: pointer; }
    .pill.active { background: var(--primary); color: white; border-color: var(--primary); }

    .kitchen-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .ticket { border-top: 5px solid var(--primary); padding: 0; }
    .ticket-header { padding: 1rem; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center; }
    .table-num { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }
    .time { font-size: 0.8rem; color: var(--text-secondary); }

    .ticket-items { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .item { display: flex; gap: 1rem; position: relative; }
    .qty { font-weight: 800; color: var(--primary); background: var(--primary-light); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 0.8rem; }
    .name { font-weight: 600; flex: 1; }
    .note { font-size: 0.75rem; color: #EF4444; font-weight: 500; font-style: italic; position: absolute; bottom: -1rem; left: 2.5rem; }

    .ticket-footer { padding: 1rem; background: var(--bg-page); }
    .btn-prepare { width: 100%; padding: 0.75rem; border-radius: 8px; border: none; background: #6366F1; color: white; font-weight: 600; cursor: pointer; }
  `]
})
export class KitchenComponent implements OnInit {
  ngOnInit(): void {}
}
