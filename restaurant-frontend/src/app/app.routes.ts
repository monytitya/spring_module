import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'roles', 
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) 
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent) 
  },
  { 
    path: 'menu', 
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent) 
  },
  { 
    path: 'tables', 
    loadComponent: () => import('./pages/tables/tables.component').then(m => m.TablesComponent) 
  },
  { 
    path: 'kitchen', 
    loadComponent: () => import('./pages/kitchen/kitchen.component').then(m => m.KitchenComponent) 
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent) 
  },
  { path: '**', redirectTo: 'dashboard' }
];
