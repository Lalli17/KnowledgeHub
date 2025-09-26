import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

// ----------------------
// Data Models
// ----------------------
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
  status?: string;
  DateSubmitted?: Date;
  updatedAt?: Date;

  // ✅ Ratings & reviews support
  averageRating?: number;
  ratingsCount?: number;
  reviews?: ReviewDto[];
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

  // ✅ Flexible backend return types
  status?: string | number; 
  action?: string;   
  categoryName?: string; 
  dateSubmitted?: string; 
}

export interface ReviewPayload { 
  articleIds: number[]; 
  action: 'Approve' | 'Reject'; 
}

export interface ReviewDto {
  id: number;
  ratingNumber: number;
  review: string;
  name: string;
  ratedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

// ----------------------
// Service
// ----------------------
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // -------- Categories --------
  getCategories(): Observable<Category[]> { 
    return this.http.get<Category[]>(`${this.base}/Category`); 
  }

  createCategory(payload: any): Observable<any> { 
    return this.http.post(`${this.base}/Category`, payload); 
  }

  // -------- URLs --------
  browseUrls(): Observable<BrowseUrl[]> {
    return this.http.get<BrowseUrl[]>(`${this.base}/ArticleReview/browse`);
  }

  submitUrl(payload: SubmitUrlPayload): Observable<any> { 
    return this.http.post(`${this.base}/ArticleReview/submit`, payload); 
  }

  // Dashboard
  getDashboardAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.base}/Dashboard/analytics`);
  }

  // -------- Admin: Pending / Approve / Reject --------
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

  // -------- Ratings --------
  submitRating(articleId: number, rating: number) {
  return this.http.post<{ averageRating: number; ratingsCount: number }>(
    `${this.base}/ArticleReview/rate/${articleId}`,
    { rating }
  );
}


  // -------- Reviews --------
  submitReview(articleId: number, review: string) {
  return this.http.post<any>(
    `${this.base}/ArticleReview/review/${articleId}`,
    { review }
  );
}


  // Extra (legacy, not used now)
  addRating(articleId: number, rating: number) {
    return this.http.post(`/api/ratings`, { articleId, rating });
  }

  // addReview(articleId: number, review: string) {
  //   return this.http.post(`/api/reviews`, { articleId, review });
  // }

  // -------- Users --------
  listUsers(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.base}/users`); 
  }
}
