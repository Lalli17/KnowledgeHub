import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories() { return this.http.get<any[]>(`${this.base}/categories`); }
  createCategory(payload: any) { return this.http.post(`${this.base}/categories`, payload); }

  // URLs
  browseUrls() { return this.http.get<any[]>(`${this.base}/urls`); } // public
  submitUrl(payload: any) { return this.http.post(`${this.base}/urls`, payload); }

  // Approve / Reject
  getPendingUrls() { return this.http.get<any[]>(`${this.base}/urls/pending`); }
  approveUrl(id: number) { return this.http.post(`${this.base}/urls/${id}/approve`, {}); }
  rejectUrl(id: number) { return this.http.post(`${this.base}/urls/${id}/reject`, {}); }

  // Users
  listUsers() { return this.http.get<any[]>(`${this.base}/users`); }

  // Auth (if you prefer)
  login(payload: any) { return this.http.post(`${this.base}/auth/login`, payload); }
  register(payload: any) { return this.http.post(`${this.base}/auth/register`, payload); }
}
