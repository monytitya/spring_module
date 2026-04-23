import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers-container">
      <div class="page-header">
        <h1>Loyal Customers</h1>
        <button class="btn-primary">+ Add New Customer</button>
      </div>

      <div class="customers-table card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of customers">
              <td>
                <div class="user-cell">
                  <img src="https://ui-avatars.com/api/?name={{c.name}}&background=random" alt="Avatar">
                  <span>{{ c.name }}</span>
                </div>
              </td>
              <td>{{ c.phone }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.orders }}</td>
              <td class="text-orange">\$ {{ c.spent | number:'1.2-2' }}</td>
              <td>{{ c.lastVisit }}</td>
              <td>
                <button class="icon-btn">✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .customers-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }

    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem; font-size: 0.85rem; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }

    .user-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
    .user-cell img { width: 32px; height: 32px; border-radius: 50%; }

    .icon-btn { background: var(--bg-page); border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; }
  `]
})
export class CustomersComponent implements OnInit {
  customers = [
    { name: 'Claudya Chintia', phone: '098-765-4321', email: 'claudya@example.com', orders: 45, spent: 850.50, lastVisit: '2 hours ago' },
    { name: 'Peter Draw', phone: '011-222-3333', email: 'peter@example.com', orders: 12, spent: 320.00, lastVisit: 'Yesterday' },
    { name: 'Mony Titya', phone: '012-345-6789', email: 'mony@example.com', orders: 89, spent: 1250.75, lastVisit: 'Currently Active' }
  ];

  ngOnInit(): void {}
}
