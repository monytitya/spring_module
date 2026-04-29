import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private apiUrl = 'http://localhost:9009/api/settings';

  constructor(private http: HttpClient) {}

  getAllSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.apiUrl);
  }

  getSettingsByGroup(group: string): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${this.apiUrl}/group/${group}`);
  }

  updateSetting(id: number, setting: Setting): Observable<Setting> {
    return this.http.put<Setting>(`${this.apiUrl}/${id}`, setting);
  }
}
