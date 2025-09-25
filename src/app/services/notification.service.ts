import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService, ReviewArticleDto, ArticleDto } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private dashboardService: DashboardService) {}

  reviewArticles(payload: ReviewArticleDto): void {
    this.dashboardService.reviewArticles(payload).subscribe({
      next: () => {
        console.log('Articles reviewed successfully');
      },
      error: (error: any) => {
        console.error('Error reviewing articles:', error);
      }
    });
  }

  submitArticle(payload: ArticleDto): void {
    this.dashboardService.submitArticle(payload).subscribe({
      next: () => {
        console.log('Article submitted successfully');
      },
      error: (error: any) => {
        console.error('Error submitting article:', error);
      }
    });
  }

  sendReviewNotification(payload: ReviewArticleDto): Observable<any> {
    return this.dashboardService.reviewArticles(payload);
  }
}
