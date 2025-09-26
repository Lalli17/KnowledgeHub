import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

// Data Models
export interface Category { id: number; categoryName: string; categoryDescription: string; }
export interface BrowseUrl { title: string; url: string; description: string; postedBy: string; categoryName: string; }
export interface SubmitUrlPayload { title: string; url: string; description: string; categoryId: number; }
export interface PendingUrl { articleIds: number[]; title: string; url: string; } // Matching your component's needs
export interface ReviewPayload { articleIds: number[]; action: 'Approve' | 'Reject'; }
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
}


@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${this.base}/Category`); }
  createCategory(payload: any): Observable<any> { return this.http.post(`${this.base}/Category`, payload); }

  // URLs
  browseUrls(): Observable<BrowseUrl[]> { return this.http.get<BrowseUrl[]>(`${this.base}/ArticleReview/browse`); }
  submitUrl(payload: SubmitUrlPayload): Observable<any> { return this.http.post(`${this.base}/ArticleReview/submit`, payload); }

  // Admin: Approve / Reject
  getPendingUrls(categoryId: number = 1): Observable<PendingUrl[]> {
    return this.http.get<PendingUrl[]>(`${this.base}/ArticleReview/pending?categoryId=${categoryId}`);
  }
  reviewUrls(payload: ReviewPayload): Observable<any> {
    return this.http.post(`${this.base}/ArticleReview/review`, payload);
  }

  // --- THIS IS THE FIX ---
  // Adding back the methods that approve-urls.ts expects.
  // They now call the correct backend endpoint via reviewUrls.
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
      `${this.base}/rate/${articleId}`,
      { rating }
    );
  }

  // Reviews
  submitReview(articleId: number, review: string) {
    return this.http.post<any>(
      `${this.base}/review/${articleId}`,
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


  // Users
  listUsers(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/users`); }
}