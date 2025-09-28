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
  id: number;
  title: string;
  url: string;
  description: string;
  postedBy: string;
  categoryName: string;
  averageRating: number;   // ✅ add this
  ratingsCount: number;    // ✅ add this
  reviews?: ReviewDto[];   // optional if backend sends reviews
}

export interface ReviewDto {
  id: number;
  ratingNumber: number;
  review: string;
  name: string;
  ratedAt: string;
  status?: string;
  DateSubmitted?: Date;
  updatedAt?: Date;
}

export interface SubmitUrlPayload {
  title: string;
  url: string;
  description: string;
  categoryId: number;
  authorName?: string;
  authorEmail?: string;
}

export interface PendingUrl { 
  articleIds: number[]; 
  title: string; 
  url: string; 
  // Backends may return either `status` (enum/string) or `action` (string)
  status?: string | number; 
  action?: string;   
  // From Article entity
  categoryName?: string; // projected from Category.CategoryName
  dateSubmitted?: string; // ISO date from Article.DateSubmitted
}

export interface ReviewPayload { 
  articleIds: number[]; 
  action: 'Approve' | 'Reject'; 
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}


@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

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

  // Add method to get dashboard analytics
  getDashboardAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.base}/Dashboard/analytics`);
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

  // -------------------------
  // Ratings
  submitRating(articleId: number, rating: number) {
    return this.http.post<{ averageRating: number; ratingsCount: number }>(
      `${this.base}/ArticleReview/rate/${articleId}`,
      { rating }
    );
  }

  // Reviews
  submitReview(articleId: number, review: string) {
    return this.http.post<any>(
      `${this.base}/ArticleReview/review/${articleId}`,
      { review }
    );
  }


  // Add ratings and reviews
  addRating(articleId: number, rating: number) {
    return this.http.post(`/api/ratings`, { articleId, rating });
  }

  // addReview(articleId: number, review: string) {
  //   return this.http.post(`/api/reviews`, { articleId, review });
  // }



  // Ratings
  getArticleRatings(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/Ratings/article/${articleId}`);
  }

  getArticleAverageRating(articleId: number): Observable<number> {
    return this.http.get<number>(`${this.base}/Ratings/average/${articleId}`);
  }

  // Rejected Articles
  getRejectedArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/ArticleReview/rejected`);
  }

  // Users
 
  getUsers() {
    return this.http.get<any[]>(`${this.base}/Users`);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.base}/Users/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.base}/Users/${id}`);
  }
}
