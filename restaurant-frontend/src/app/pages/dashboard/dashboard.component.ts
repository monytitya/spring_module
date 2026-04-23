import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { MenuService } from '../../core/services/common.service';
import { Order } from '../../core/models/restaurant.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1>Analytics</h1>
        <div class="breadcrumb">Analytics / Analytics</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total Orders</p>
            <h2 class="stat-value">{{ totalOrders }}</h2>
          </div>
          <div class="stat-chart">
            <canvas #ordersChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Menu Items</p>
            <h2 class="stat-value">{{ totalMenuItems }}</h2>
          </div>
          <div class="stat-chart">
            <canvas #menuChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total Revenue</p>
            <h2 class="stat-value">\$ {{ totalRevenue | number:'1.2-2' }}</h2>
          </div>
          <div class="stat-chart">
            <canvas #revenueChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total Customers</p>
            <h2 class="stat-value">221</h2>
          </div>
          <div class="stat-chart">
            <canvas #customerChartCanvas></canvas>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <div class="sales-statistic card">
          <div class="card-header">
            <h3>Sales Statistic</h3>
            <select class="period-select">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div class="chart-container">
            <canvas #salesChartCanvas></canvas>
          </div>
        </div>

        <div class="best-seller-section">
          <div class="card best-sellers">
            <h3>Best Seller Menus</h3>
            <div class="seller-list">
              <div class="seller-item">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=100" alt="Dish">
                <div class="seller-info">
                  <p class="name">Spinach with Roasted Crab</p>
                  <p class="price">\$6.73</p>
                </div>
                <div class="stats">
                  <span>❤️ 25k</span>
                  <span>📈 6.723</span>
                </div>
              </div>
              <div class="seller-item">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100" alt="Dish">
                <div class="seller-info">
                  <p class="name">Chicken Teriyaki</p>
                  <p class="price">\$6.73</p>
                </div>
                <div class="stats">
                  <span>❤️ 25k</span>
                  <span>📈 6.723</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h1 { font-size: 1.5rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--text-secondary); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .stat-label { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .stat-value { font-size: 1.75rem; color: var(--text-main); margin: 0; }
    .stat-chart { width: 60px; height: 60px; }

    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .period-select {
      background: var(--bg-page);
      border: 1px solid var(--border);
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-family: inherit;
      outline: none;
    }

    .chart-container { height: 300px; }

    .best-seller-section { display: flex; flex-direction: column; gap: 1.5rem; }

    .seller-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
    .seller-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .seller-item:last-child { border-bottom: none; }

    .seller-item img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
    .seller-info { flex: 1; }
    .seller-info .name { font-weight: 600; font-size: 0.9rem; }
    .seller-info .price { color: var(--primary); font-weight: 600; font-size: 0.9rem; }
    
    .seller-item .stats {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef;
  @ViewChild('ordersChartCanvas') ordersChartCanvas!: ElementRef;
  @ViewChild('menuChartCanvas') menuChartCanvas!: ElementRef;
  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef;
  @ViewChild('customerChartCanvas') customerChartCanvas!: ElementRef;

  totalOrders = 0;
  totalRevenue = 0;
  totalMenuItems = 0;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  fetchStats(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      this.totalRevenue = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
    });

    this.menuService.getMenuItems().subscribe(items => {
      this.totalMenuItems = items.length;
    });
  }

  initCharts(): void {
    // Sales Bar Chart
    new Chart(this.salesChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 05'],
        datasets: [
          {
            label: 'Beverages',
            data: [40, 60, 45, 70, 50],
            backgroundColor: '#FF6635',
            borderRadius: 5,
            barThickness: 15
          },
          {
            label: 'Food',
            data: [60, 80, 75, 90, 70],
            backgroundColor: '#6366F1',
            borderRadius: 5,
            barThickness: 15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#F1F5F9' } }
        }
      }
    });

    // Small stat charts
    const createMiniChart = (canvas: ElementRef, color: string) => {
      new Chart(canvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [70, 30],
            backgroundColor: [color, '#F1F5F9'],
            borderWidth: 0,
            cutout: '80%'
          } as any]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    };

    createMiniChart(this.ordersChartCanvas, '#FF6635');
    createMiniChart(this.menuChartCanvas, '#6366F1');
    createMiniChart(this.revenueChartCanvas, '#10B981');
    createMiniChart(this.customerChartCanvas, '#F59E0B');
  }
}
