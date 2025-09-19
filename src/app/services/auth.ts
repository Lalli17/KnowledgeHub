import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LoginResp { token: string; role: string; email: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'kh_token';
  private userKey = 'kh_user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResp>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify({ email: res.email, role: res.role }));
        }
      }));
  }

  register(payload: any) {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }

  getCurrentUser() {
    const v = localStorage.getItem(this.userKey);
    return v ? JSON.parse(v) : null;
  }

  isLoggedIn(): boolean { return !!this.getToken(); }

  isAdmin(): boolean {
    const u = this.getCurrentUser();
    return u && u.role === 'A';
  }
}
