import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api';
import { ArticleMetrics } from '../modules/dashboard/models/article-metrics.model';

export interface ReviewArticleDto {
  articleIds: number[];
  action: 'Approve' | 'Reject';
}

export interface ArticleDto {
  id: number;
  title: string;
  url: string;
  description: string;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getArticleMetrics(): Observable<ArticleMetrics[]> {
    return this.apiService.browseUrls();
  }

  getPendingUrls(): Observable<any[]> {
    return this.apiService.getPendingUrls();
  }

  getPendingArticles(): Observable<any[]> {
    return this.apiService.getPendingUrls();
  }

  browseArticles(): Observable<ArticleMetrics[]> {
    return this.apiService.browseUrls();
  }

  reviewArticles(payload: ReviewArticleDto): Observable<any> {
    return this.apiService.reviewUrls(payload);
  }

  submitArticle(payload: ArticleDto): Observable<any> {
    return this.apiService.submitUrl(payload);
  }

  getTotalArticlesCount(): Observable<number> {
    return this.apiService.browseUrls().pipe(
      map((articles: ArticleMetrics[]) => articles.length)
    );
  }

  getPendingArticlesCount(): Observable<number> {
    return this.apiService.getPendingUrls().pipe(
      map((pendingArticles: any[]) => pendingArticles.length)
    );
  }

  getRejectedArticlesCount(): Observable<number> {
    return this.apiService.getRejectedArticles().pipe(
      map((rejectedArticles: any[]) => rejectedArticles.length)
    );
  }

  getRatedArticlesCount(): Observable<number> {
    return this.apiService.browseUrls().pipe(
      map((articles: any[]) => articles.filter(article => article.ratingsCount > 0).length)
    );
  }

  getAverageRatings(): Observable<number> {
    return this.apiService.browseUrls().pipe(
      map((articles: any[]) => {
        const ratedArticles = articles.filter(article => article.ratingsCount > 0);
        if (ratedArticles.length === 0) return 0;
        const total = ratedArticles.reduce((sum, article) => sum + article.averageRating, 0);
        return total / ratedArticles.length;
      })
    );
  }

  getCategoryWiseArticleCounts(): Observable<any[]> {
    return this.apiService.browseUrls().pipe(
      map((articles: ArticleMetrics[]) => {
        const categoryCounts: { [key: string]: number } = articles.reduce((acc, article) => {
          const category = article.categoryName;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        return Object.keys(categoryCounts).map(category => ({
          category: category,
          count: categoryCounts[category]
        }));
      })
    );
  }

  getMonthlyArticleCounts(): Observable<any[]> {
    return this.apiService.browseUrls().pipe(
      map((articles: ArticleMetrics[]) => {
        const monthlyCounts: { [key: string]: number } = articles.reduce((acc, article) => {
        const date = article.DateSubmitted ? new Date(article.DateSubmitted) : new Date();
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        return Object.keys(monthlyCounts).map(month => ({
          month: month,
          count: monthlyCounts[month]
        }));
      })
    );
  }

  getTopPublishers(): Observable<any[]> {
    return this.apiService.browseUrls().pipe(
      map((articles: ArticleMetrics[]) => {
        const publisherCounts: { [key: string]: number } = articles.reduce((acc, article) => {
          const publisher = article.postedBy || 'Unknown';
          acc[publisher] = (acc[publisher] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        return Object.keys(publisherCounts)
          .map(publisher => ({
            publisher: publisher,
            count: publisherCounts[publisher]
          }))
          .sort((a, b) => b.count - a.count) // Sort by count descending
          .slice(0, 10); // Top 10 publishers
      })
    );
  }
}
