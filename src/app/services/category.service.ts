import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// export interface Category {
//   id: number;
//   name: string;
//   description: string;
// }

export interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
}


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://localhost:7298/api/Category'; // ⚠️ update with your backend URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // create(category: Partial<Category>): Observable<any> {
  //   return this.http.post(this.apiUrl, category);
  // }

  // update(id: number, category: Partial<Category>): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, category);
  // }

  // create(category: Partial<Category>): Observable<any> {
  //   return this.http.post(this.apiUrl, category, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }


// create(category: Partial<Category>): Observable<any> {
//   return this.http.post(this.apiUrl, category);
// }

//this will only create trhe data in the backend but will not send it back
create(category: Partial<Category>): Observable<any> {
  return this.http.post(this.apiUrl, category, { responseType: 'text' });
}


// update(id: number, category: Partial<Category>): Observable<any> {
//   return this.http.put(`${this.apiUrl}/${id}`, category);
// }

update(id: number, category: Partial<Category>): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, category, { responseType: 'text' });
}




  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
