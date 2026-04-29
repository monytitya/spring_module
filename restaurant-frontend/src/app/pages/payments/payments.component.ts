import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { Order, Payment } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payments-container">
      <div class="page-header">
        <h1>POS Payment Center</h1>
        <div class="breadcrumb">Payments / Checkout</div>
      </div>

      <div class="payment-layout">
        <!-- Order Selection & Details -->
        <div class="order-section card">
          <div class="section-header">
            <h3>Select Active Order</h3>
            <select class="order-picker" [(ngModel)]="selectedOrderId" (change)="loadOrderDetails()">
              <option [ngValue]="null">Choose an order...</option>
              <option *ngFor="let o of activeOrders" [value]="o.id">
                #{{ o.id }} - {{ o.tableName }} (Remaining: \${{ o.remainingAmount | number:'1.2-2' }})
              </option>
            </select>
          </div>

          <div class="order-preview" *ngIf="currentOrder">
            <div class="order-meta">
              <div class="meta-item">
                <label>Table</label>
                <p>{{ currentOrder.tableName }}</p>
              </div>
              <div class="meta-item">
                <label>Staff</label>
                <p>{{ currentOrder.staffName }}</p>
              </div>
              <div class="meta-item">
                <label>Status</label>
                <p><span class="status-badge" [class]="currentOrder.status">{{ currentOrder.status }}</span></p>
              </div>
            </div>

            <div class="bill-summary">
              <div class="summary-row">
                <span>Total Amount</span>
                <span>\$ {{ currentOrder.totalAmount | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Discount</span>
                <span class="text-orange">- \$ {{ currentOrder.discountAmount | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row total">
                <span>Final Balance</span>
                <span>\$ {{ currentOrder.finalAmount | number:'1.2-2' }}</span>
              </div>
              <hr>
              <div class="summary-row paid">
                <span>Already Paid</span>
                <span>\$ {{ currentOrder.paidAmount | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row remaining">
                <span>Owed Amount</span>
                <span class="text-orange highlight">\$ {{ currentOrder.remainingAmount | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <div class="no-selection" *ngIf="!currentOrder">
            <p>Please select an order to process payment</p>
          </div>
        </div>

        <!-- Payment Actions -->
        <div class="payment-section">
          <div class="card payment-form" *ngIf="currentOrder">
            <h3>Process Payment</h3>
            
            <div class="method-selector">
              <label>Payment Method</label>
              <div class="methods">
                <button class="method-btn" [class.active]="newPayment.method === 'CASH'" (click)="newPayment.method = 'CASH'">
                  💵 CASH
                </button>
                <button class="method-btn" [class.active]="newPayment.method === 'KHQR'" (click)="newPayment.method = 'KHQR'">
                  📱 KHQR
                </button>
                <button class="method-btn" [class.active]="newPayment.method === 'CARD'" (click)="newPayment.method = 'CARD'">
                  💳 CARD
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Paying Amount</label>
              <div class="input-wrap">
                <span class="currency-tag">\$</span>
                <input type="number" [(ngModel)]="newPayment.amount" [max]="currentOrder.remainingAmount">
              </div>
              <div class="quick-suggest">
                <button (click)="newPayment.amount = currentOrder.remainingAmount">Pay Full Amout</button>
              </div>
            </div>

            <div class="form-group" *ngIf="newPayment.method === 'KHQR'">
              <label>KHQR Reference</label>
              <input type="text" placeholder="Transaction Ref #" [(ngModel)]="newPayment.khqrRef">
            </div>

            <button class="btn-primary full-width" (click)="submitPayment()">
              {{ newPayment.method === 'KHQR' ? 'Generate KHQR' : 'Complete Transaction' }}
            </button>
          </div>

          <!-- KHQR Display Modal -->
          <div class="qr-modal-overlay" *ngIf="showQRModal">
            <div class="qr-modal card">
              <div class="qr-header">
                <img src="assets/bakong-logo.png" alt="Bakong" class="bakong-logo" onerror="this.src='https://bakong.nbc.gov.kh/assets/img/bakong-logo.png'">
                <h3>Scan to Pay</h3>
                <button class="close-btn" (click)="showQRModal = false">×</button>
              </div>
              
              <div class="qr-body">
                <div class="qr-container">
                  <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodedQR" alt="KHQR">
                </div>
                <div class="payment-info">
                  <p class="amount">\$ {{ newPayment.amount | number:'1.2-2' }}</p>
                  <p class="order-id">Order #{{ currentOrder?.id }}</p>
                </div>
              </div>
              
              <div class="qr-footer">
                <div class="loader-row">
                  <div class="spinner"></div>
                  <span>Waiting for payment...</span>
                </div>
                <button class="btn-secondary full-width" (click)="showQRModal = false">Cancel</button>
              </div>
            </div>
          </div>

          <div class="card history" *ngIf="currentOrder && currentOrder.payments?.length">
            <h3>Payment History</h3>
            <div class="history-list">
              <div class="history-item" *ngFor="let p of currentOrder.payments">
                <div class="history-meta">
                  <span class="method">{{ p.method }}</span>
                  <span class="date">{{ p.paidAt | date:'short' }}</span>
                </div>
                <span class="amount">\$ {{ p.amount | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payments-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { margin-bottom: 0.5rem; }

    .payment-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .order-picker {
      width: 100%;
      padding: 0.75rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-page);
      font-family: inherit;
      outline: none;
      margin-top: 1rem;
    }

    .order-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }

    .meta-item label { font-size: 0.75rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem; }
    .meta-item p { font-weight: 600; font-size: 1rem; margin: 0; }

    .bill-summary { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
    .summary-row.total { font-weight: 700; font-size: 1.2rem; margin-top: 0.5rem; }
    .summary-row.remaining { font-weight: 700; font-size: 1.4rem; margin-top: 1rem; }
    .highlight { color: var(--primary); }

    .payment-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .method-selector label, .form-group label { font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.75rem; }
    
    .methods { display: flex; gap: 0.75rem; }
    .method-btn {
      flex: 1;
      padding: 1rem 0.5rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .method-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }

    .input-wrap { position: relative; }
    .currency-tag { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-weight: 700; }
    .input-wrap input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 1.2rem;
      font-weight: 700;
      outline: none;
    }

    .quick-suggest { margin-top: 0.5rem; text-align: right; }
    .quick-suggest button {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }

    .full-width { width: 100%; justify-content: center; padding: 1rem; font-size: 1.1rem; }

    .history { margin-top: 1.5rem; }
    .history-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-page);
      border-radius: 8px;
    }
    .history-meta { display: flex; flex-direction: column; }
    .history-meta .method { font-weight: 700; font-size: 0.85rem; }
    .history-meta .date { font-size: 0.75rem; color: var(--text-secondary); }
    .history-item .amount { font-weight: 700; color: #10B981; }

    .no-selection { text-align: center; padding: 4rem 0; color: var(--text-secondary); font-style: italic; }

    .status-badge {
      padding: 4px 10px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-badge.open { background: #E0F2FE; color: #0369A1; }
    .status-badge.partial { background: #FEF3C7; color: #B45309; }
    .status-badge.closed { background: #DCFCE7; color: #15803D; }

    /* QR Modal Styles */
    .qr-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .qr-modal {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
      animation: modalUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes modalUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .qr-header { display: flex; justify-content: space-between; align-items: center; }
    .qr-header h3 { margin: 0; font-size: 1.25rem; }
    .bakong-logo { height: 24px; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF; }

    .qr-container {
      background: white;
      padding: 1rem;
      border-radius: 20px;
      border: 1px solid #E5E7EB;
      margin: 1rem auto;
      width: fit-content;
    }
    
    .payment-info .amount { font-size: 2rem; font-weight: 800; color: #111827; margin: 0; }
    .payment-info .order-id { font-size: 0.9rem; color: #6B7280; margin-top: 0.25rem; }

    .loader-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: #6B7280;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #E5E7EB;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PaymentsComponent implements OnInit {
  activeOrders: Order[] = [];
  selectedOrderId: number | null = null;
  currentOrder: Order | null = null;

  newPayment: any = {
    method: 'CASH',
    amount: 0,
    khqrRef: null
  };

  showQRModal = false;
  encodedQR = '';

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchActiveOrders();
    
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.selectedOrderId = +params['orderId'];
        this.loadOrderDetails();
      }
    });
  }

  fetchActiveOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.activeOrders = orders.filter(o => o.status !== 'closed');
    });
  }

  loadOrderDetails(): void {
    if (!this.selectedOrderId) {
      this.currentOrder = null;
      return;
    }

    this.orderService.getOrder(this.selectedOrderId).subscribe(order => {
      this.currentOrder = order;
      this.newPayment.amount = order.remainingAmount;
      
      // Fetch payments for this order
      this.paymentService.getPaymentsByOrder(order.id).subscribe(payments => {
        if (this.currentOrder) this.currentOrder.payments = payments;
      });
    });
  }

  submitPayment(): void {
    if (!this.currentOrder) return;

    const payload = {
      orderId: this.currentOrder.id,
      ...this.newPayment
    };

    this.paymentService.processPayment(payload).subscribe({
      next: (res: any) => {
        if (res.qrString) {
          this.encodedQR = encodeURIComponent(res.qrString);
          this.showQRModal = true;
          // In a real app, you would start polling here to check if payment is done
        } else {
          alert('Payment successful!');
          this.loadOrderDetails();
          this.fetchActiveOrders();
          this.newPayment = { method: 'CASH', amount: 0, khqrRef: null };
        }
      },
      error: (err) => {
        alert('Error processing payment: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }
}
