import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, Table, Staff, Customer, Supplier } from '../models/restaurant.model';

// ... (existing services)

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:9009/api/suppliers';

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: any): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: any): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadSupplierImage(id: number, file: File): Observable<Supplier> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Supplier>(`${this.apiUrl}/${id}/image`, formData);
  }

  deleteSupplierImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/image`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:9009/api/menu';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  createMenuItem(item: any): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, item);
  }

  uploadItemImage(id: number, file: File): Observable<MenuItem> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MenuItem>(`${this.apiUrl}/items/${id}/image`, formData);
  }

  updateMenuItem(id: number, item: any): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, item);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = 'http://localhost:9009/api/tables';

  constructor(private http: HttpClient) {}

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  createTable(table: any): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }

  updateTable(id: number, table: any): Observable<Table> {
    return this.http.put<Table>(`${this.apiUrl}/${id}`, table);
  }

  uploadTableImage(id: number, file: File): Observable<Table> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Table>(`${this.apiUrl}/${id}/image`, formData);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'http://localhost:9009/api/staff';

  constructor(private http: HttpClient) {}

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

  createStaff(staff: any): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staff);
  }

  updateStaff(id: number, staff: any): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff);
  }

  deleteStaff(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadStaffImage(id: number, file: File): Observable<Staff> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Staff>(`${this.apiUrl}/${id}/image`, formData);
  }

  deleteStaffImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/image`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:9009/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRole(role: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, role);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:9009/api/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: any): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: any): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
