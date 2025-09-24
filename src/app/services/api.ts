// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environments';

// // Data Models
// export interface Category { id: number; categoryName: string; categoryDescription: string; }
// export interface BrowseUrl { title: string; url: string; description: string; postedBy: string; categoryName: string; }
// export interface SubmitUrlPayload { title: string; url: string; description: string; categoryId: number; }
// export interface PendingUrl { articleIds: number[]; title: string; url: string; } // Matching your component's needs
// export interface ReviewPayload { articleIds: number[]; action: 'Approve' | 'Reject'; }

// @Injectable({ providedIn: 'root' })
// export class ApiService {
//   private base = environment.apiBaseUrl;

//   constructor(private http: HttpClient) {}

//   // Categories
//   getCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${this.base}/Category`); }
//   createCategory(payload: any): Observable<any> { return this.http.post(`${this.base}/Category`, payload); }

//   // URLs
//   browseUrls(): Observable<BrowseUrl[]> { return this.http.get<BrowseUrl[]>(`${this.base}/ArticleReview/browse`); }
//   submitUrl(payload: SubmitUrlPayload): Observable<any> { return this.http.post(`${this.base}/ArticleReview/submit`, payload); }

//   // Admin: Approve / Reject
//   getPendingUrls(categoryId?: number): Observable<PendingUrl[]> {
//   const url = categoryId
//     ? `${this.base}/ArticleReview/pending?categoryId=${categoryId}`
//     : `${this.base}/ArticleReview/pending`;
//   return this.http.get<PendingUrl[]>(url);
// }

//   reviewUrls(payload: ReviewPayload): Observable<any> {
//     return this.http.post(`${this.base}/ArticleReview/review`, payload);
//   }

//   // --- THIS IS THE FIX ---
//   // Adding back the methods that approve-urls.ts expects.
//   // They now call the correct backend endpoint via reviewUrls.
//   approveUrl(id: number): Observable<any> {
//     const payload: ReviewPayload = { articleIds: [id], action: 'Approve' };
//     return this.reviewUrls(payload);
//   }

//   rejectUrl(id: number): Observable<any> {
//     const payload: ReviewPayload = { articleIds: [id], action: 'Reject' };
//     return this.reviewUrls(payload);
//   }
//   // -------------------------

//   // Users
//   listUsers(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/users`); }
// }








import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

// Data Models
export interface Category { 
  id: number; 
  categoryName: string; 
  categoryDescription: string; 
}

export interface BrowseUrl { 
  title: string; 
  url: string; 
  description: string; 
  postedBy: string; 
  categoryName: string; 
}

export interface SubmitUrlPayload { 
  title: string; 
  url: string; 
  description: string; 
  categoryId: number; 
}

export interface PendingUrl { 
  articleIds: number[]; 
  title: string; 
  url: string; 
  action: string;   // ✅ added to match backend
}

export interface ReviewPayload { 
  articleIds: number[]; 
  action: 'Approve' | 'Reject'; 
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<Category[]> { 
    return this.http.get<Category[]>(`${this.base}/Category`); 
  }

  createCategory(payload: any): Observable<any> { 
    return this.http.post(`${this.base}/Category`, payload); 
  }

  // URLs
  browseUrls(): Observable<BrowseUrl[]> { 
    return this.http.get<BrowseUrl[]>(`${this.base}/ArticleReview/browse`); 
  }

  submitUrl(payload: SubmitUrlPayload): Observable<any> { 
    return this.http.post(`${this.base}/ArticleReview/submit`, payload); 
  }

  // Admin: Pending / Approve / Reject
  getPendingUrls(categoryId?: number): Observable<PendingUrl[]> {
    const url = categoryId
      ? `${this.base}/ArticleReview/pending?categoryId=${categoryId}`
      : `${this.base}/ArticleReview/pending`;
    return this.http.get<PendingUrl[]>(url);
  }

  reviewUrls(payload: ReviewPayload): Observable<any> {
    return this.http.post(`${this.base}/ArticleReview/review`, payload);
  }

  approveUrl(id: number): Observable<any> {
    const payload: ReviewPayload = { articleIds: [id], action: 'Approve' };
    return this.reviewUrls(payload);
  }

  rejectUrl(id: number): Observable<any> {
    const payload: ReviewPayload = { articleIds: [id], action: 'Reject' };
    return this.reviewUrls(payload);
  }

  // Users
  listUsers(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.base}/users`); 
  }
}
