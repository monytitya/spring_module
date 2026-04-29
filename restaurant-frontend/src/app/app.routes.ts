import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'roles', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent) 
  },
  { 
    path: 'orders', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) 
  },
  { 
    path: 'payments', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent) 
  },
  { 
    path: 'menu', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent) 
  },
  { 
    path: 'tables', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/tables/tables.component').then(m => m.TablesComponent) 
  },
  { 
    path: 'kitchen', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/kitchen/kitchen.component').then(m => m.KitchenComponent) 
  },
  { 
    path: 'customers', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent) 
  },
  { 
    path: 'suppliers', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent) 
  },
  { 
    path: 'admin', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) 
  },
  { 
    path: 'settings', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { path: '**', redirectTo: 'dashboard' }
];
