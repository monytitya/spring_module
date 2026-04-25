export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied';
  imagePath?: string;
}

export interface Staff {
  id: number;
  name: string;
  phone: string;
  pinCode: string;
  status: string;
  role: {
    id: number;
    name: string;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imagePath?: string;
  category: {
    id: number;
    name: string;
  };
}

export interface OrderItem {
  id?: number;
  menuItemId: number;
  menuItemName?: string;
  quantity: number;
  unitPrice?: number;
  subtotalAmount?: number;
  note?: string;
  kitchenStatus?: string;
}

export interface Order {
  id: number;
  tableId: number;
  tableName: string;
  staffId: number;
  staffName: string;
  status: 'open' | 'partial' | 'closed';
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
  items: OrderItem[];
  payments?: Payment[];
}

export interface Payment {
  id?: number;
  orderId: number;
  method: 'CASH' | 'KHQR' | 'CARD';
  amount: number;
  discountAmount?: number;
  khqrRef?: string;
  paidAt?: string;
  totalPaidAmount?: number;
  remainingAmount?: number;
  orderStatus?: string;
}
