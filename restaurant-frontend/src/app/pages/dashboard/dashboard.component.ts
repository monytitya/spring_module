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
        <div class="header-left">
          <h1>Dashboard Overview</h1>
          <p class="subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div class="breadcrumb">
          <span>Analytics</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          <span class="current">Overview</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card orange">
          <div class="stat-info">
            <p class="stat-label">Total Orders</p>
            <h2 class="stat-value">{{ totalOrders }}</h2>
            <p class="stat-delta positive">+12.5% <span>vs last month</span></p>
          </div>
          <div class="stat-visual">
            <canvas #ordersChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-info">
            <p class="stat-label">Menu Items</p>
            <h2 class="stat-value">{{ totalMenuItems }}</h2>
            <p class="stat-delta">Stable <span>vs last week</span></p>
          </div>
          <div class="stat-visual">
            <canvas #menuChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-info">
            <p class="stat-label">Total Revenue</p>
            <h2 class="stat-value">$ {{ totalRevenue | number:'1.2-2' }}</h2>
            <p class="stat-delta positive">+8.2% <span>vs last month</span></p>
          </div>
          <div class="stat-visual">
            <canvas #revenueChartCanvas></canvas>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="stat-info">
            <p class="stat-label">Total Customers</p>
            <h2 class="stat-value">221</h2>
            <p class="stat-delta positive">+5.4% <span>vs yesterday</span></p>
          </div>
          <div class="stat-visual">
            <canvas #customerChartCanvas></canvas>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <div class="sales-statistic card">
          <div class="card-header">
            <div class="header-content">
              <h3>Sales Statistic</h3>
              <p class="card-subtitle">Weekly revenue breakdown by category</p>
            </div>
            <div class="header-actions">
              <select class="period-select">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas #salesChartCanvas></canvas>
          </div>
        </div>

        <div class="best-seller-section">
          <div class="card best-sellers">
            <div class="card-header">
              <h3>Best Seller Menus</h3>
              <a href="#" class="view-all">View All</a>
            </div>
            <div class="seller-list">
              <div class="seller-item">
                <div class="img-container">
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=100" alt="Dish">
                </div>
                <div class="seller-info">
                  <p class="name">Spinach with Roasted Crab</p>
                  <p class="category">Seafood • Main Course</p>
                </div>
                <div class="seller-stats">
                  <div class="stat-pill">
                    <span class="value">25k</span>
                    <span class="label">Likes</span>
                  </div>
                  <div class="stat-pill">
                    <span class="value">6.7k</span>
                    <span class="label">Sales</span>
                  </div>
                </div>
              </div>
              <div class="seller-item">
                <div class="img-container">
                  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100" alt="Dish">
                </div>
                <div class="seller-info">
                  <p class="name">Chicken Teriyaki</p>
                  <p class="category">Japanese • Fast Food</p>
                </div>
                <div class="seller-stats">
                  <div class="stat-pill">
                    <span class="value">18k</span>
                    <span class="label">Likes</span>
                  </div>
                  <div class="stat-pill">
                    <span class="value">5.2k</span>
                    <span class="label">Sales</span>
                  </div>
                </div>
              </div>
              <div class="seller-item">
                <div class="img-container">
                  <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100" alt="Dish">
                </div>
                <div class="seller-info">
                  <p class="name">Special Beef BBQ</p>
                  <p class="category">Grill • Premium</p>
                </div>
                <div class="seller-stats">
                  <div class="stat-pill">
                    <span class="value">12k</span>
                    <span class="label">Likes</span>
                  </div>
                  <div class="stat-pill">
                    <span class="value">4.1k</span>
                    <span class="label">Sales</span>
                  </div>
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
      gap: 2rem;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .header-left h1 { font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .header-left .subtitle { color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem; }

    .breadcrumb { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
      font-size: 0.85rem; 
      color: var(--text-secondary);
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 100px;
      border: 1px solid var(--border);
    }
    .breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .breadcrumb .current { color: var(--primary); font-weight: 600; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 24px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
      border: 1px solid var(--border);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
    }

    .stat-info { flex: 1; }
    .stat-label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin: 0; line-height: 1.2; }
    
    .stat-delta { font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem; }
    .stat-delta span { font-weight: 400; opacity: 0.7; }
    .stat-delta.positive { color: #10B981; }
    .stat-delta.positive::before { content: '↑'; }

    .stat-visual { width: 70px; height: 70px; }

    .stat-card.orange { border-bottom: 4px solid #FF6635; }
    .stat-card.blue { border-bottom: 4px solid #6366F1; }
    .stat-card.green { border-bottom: 4px solid #10B981; }
    .stat-card.purple { border-bottom: 4px solid #8B5CF6; }

    .main-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 24px;
      padding: 1.75rem;
      border: 1px solid var(--border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .card-header h3 { font-size: 1.25rem; font-weight: 700; margin: 0; }
    .card-subtitle { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; }

    .period-select {
      background: var(--bg-page);
      border: 1px solid var(--border);
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      outline: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .period-select:hover { border-color: var(--primary); }

    .chart-wrapper { height: 320px; }

    .view-all { font-size: 0.85rem; font-weight: 600; color: var(--primary); text-decoration: none; }
    .view-all:hover { text-decoration: underline; }

    .seller-list { display: flex; flex-direction: column; gap: 1.25rem; }
    
    .seller-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1rem;
      border-radius: 16px;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .seller-item:hover {
      background: var(--bg-page);
      border-color: var(--border);
      transform: translateX(5px);
    }

    .img-container {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    .img-container img { width: 100%; height: 100%; object-fit: cover; }

    .seller-info { flex: 1; }
    .seller-info .name { font-weight: 700; font-size: 0.95rem; margin: 0; color: var(--text-main); }
    .seller-info .category { font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem; }
    
    .seller-stats { display: flex; gap: 0.5rem; }
    
    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      padding: 0.4rem 0.75rem;
      border-radius: 10px;
      min-width: 55px;
      border: 1px solid var(--border);
    }
    
    .stat-pill .value { font-weight: 700; font-size: 0.85rem; color: var(--text-main); }
    .stat-pill .label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; }
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
            borderRadius: 6,
            barThickness: 12
          },
          {
            label: 'Food',
            data: [60, 80, 75, 90, 70],
            backgroundColor: '#6366F1',
            borderRadius: 6,
            barThickness: 12
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { 
            display: true, 
            position: 'top', 
            align: 'end',
            labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12, weight: 500 } }
          } 
        },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { grid: { color: '#F1F5F9' }, border: { display: false }, ticks: { padding: 10 } }
        }
      }
    });

    // Small stat charts
    const createMiniChart = (canvas: ElementRef, color: string) => {
      new Chart(canvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [75, 25],
            backgroundColor: [color, '#F1F5F9'],
            borderWidth: 0,
            cutout: '85%'
          } as any]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          animation: { animateRotate: true, animateScale: true }
        }
      });
    };

    createMiniChart(this.ordersChartCanvas, '#FF6635');
    createMiniChart(this.menuChartCanvas, '#6366F1');
    createMiniChart(this.revenueChartCanvas, '#10B981');
    createMiniChart(this.customerChartCanvas, '#8B5CF6');
  }
}
