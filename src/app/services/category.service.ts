import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/Category`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Create new category
  create(category: Partial<Category>): Observable<any> {
    return this.http.post(this.apiUrl, category, { responseType: 'text' });
  }

  // ✅ New method to check if category exists
  checkExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?name=${encodeURIComponent(name)}`);
  }

  update(id: number, category: Partial<Category>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category, { responseType: 'text' });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
