import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// THIS IS THE FIX: The interface now expects 'roles' as an array of strings, matching your backend.
interface LoginResp {
  token: string;
  name: string;
  email: string;
  roles: string[]; // Changed from 'role: string'
}

// This interface defines the shape of the user object we store in localStorage.
interface StoredUser {
  email: string;
  name: string;
  roles: string[];
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'kh_token';
  private userKey = 'kh_user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          // Handle if backend returns 'role' as string or 'roles' as array
          let roles: string[] = [];
          if (res.roles && Array.isArray(res.roles)) {
            roles = res.roles;
          } else if (res.role) {
            roles = [res.role]; // Assume 'A' for admin, etc.
          }
          localStorage.setItem(this.userKey, JSON.stringify({ email: res.email, name: res.name, roles }));
        }
      }));
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // This function now correctly returns the StoredUser type or null.
  getCurrentUser(): StoredUser | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // This function is now more robust and correctly checks the 'roles' array.
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    // Check if a user exists, if they have a 'roles' property, and if that array includes 'Admin' or 'A'.
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes('Admin') || user.roles.includes('A');
  }
}