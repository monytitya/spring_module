import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, Table, Staff } from '../models/restaurant.model';

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
