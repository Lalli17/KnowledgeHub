import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth';
import { ApiService, BrowseUrl } from '../../services/api';
import { ArticleMetrics } from '../../modules/dashboard/models/article-metrics.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // Dashboard data
  articles: ArticleMetrics[] = [];
  recentActivities: any[] = [];
  recentArticles: BrowseUrl[] = [];
  monthlyData: any[] = [];
  topPublishers: any[] = [];
  approvedArticlesCount: number = 0;
  pendingArticlesCount: number = 0;
  rejectedArticlesCount: number = 0;
  ratedArticlesCount: number = 0;
  averageRating: number = 0;
  categoryData: any[] = [];

  // Auth state
  isLoggedIn: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load data that should be visible to all users
    this.loadCategoryData();
    this.loadTopPublishers();
    this.loadRecentArticles();
    this.loadApprovedArticlesCount(); // Total count is not sensitive

    // Only load sensitive metrics if user is logged in
    if (this.isLoggedIn) {
      this.loadPendingArticlesCount();
      this.loadRejectedArticlesCount();
      this.loadRatedArticlesCount();
      this.loadAverageRating();
    }
  }

  loadRecentArticles(): void {
    this.apiService.browseUrls().subscribe({
      next: (data) => {
        // Sort articles by average rating in descending order, then take top 3
        this.recentArticles = (data || [])
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading recent articles:', error);
        this.recentArticles = [];
      }
    });
  }

  loadArticles(): void {
    this.dashboardService.getArticleMetrics().subscribe({
      next: (data) => {
        this.articles = data;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.recentActivities = this.articles.filter(article => {
          if (!article.DateSubmitted) return false;
          const articleDate = new Date(article.DateSubmitted);
          const normalizedArticleDate = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate());
          return normalizedArticleDate >= today;
        });

        this.generateMonthlyData();
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }

  loadApprovedArticlesCount(): void {
    this.dashboardService.getTotalArticlesCount().subscribe({
      next: (count) => {
        this.approvedArticlesCount = count;
      },
      error: (error) => {
        console.error('Error loading approved articles count:', error);
      }
    });
  }

  loadPendingArticlesCount(): void {
    this.dashboardService.getPendingArticlesCount().subscribe({
      next: (count) => {
        this.pendingArticlesCount = count;
      },
      error: (error) => {
        console.error('Error loading pending articles count:', error);
      }
    });
  }

  loadRejectedArticlesCount(): void {
    this.dashboardService.getRejectedArticlesCount().subscribe({
      next: (count) => {
        this.rejectedArticlesCount = count;
      },
      error: (error) => {
        console.error('Error loading rejected articles count:', error);
      }
    });
  }

  loadRatedArticlesCount(): void {
    this.dashboardService.getRatedArticlesCount().subscribe({
      next: (count) => {
        this.ratedArticlesCount = count;
      },
      error: (error) => {
        console.error('Error loading rated articles count:', error);
      }
    });
  }

  loadAverageRating(): void {
    this.dashboardService.getAverageRatings().subscribe({
      next: (avg) => {
        this.averageRating = avg;
      },
      error: (error) => {
        console.error('Error loading average rating:', error);
      }
    });
  }

  loadCategoryData(): void {
    this.dashboardService.getCategoryWiseArticleCounts().subscribe({
      next: (data) => {
        // Sort categories by article count in descending order
        this.categoryData = data.sort((a, b) => b.count - a.count);
      },
      error: (error) => {
        console.error('Error loading category data:', error);
      }
    });
  }

  loadTopPublishers(): void {
    this.dashboardService.getTopPublishers().subscribe({
      next: (data) => {
        this.topPublishers = data;
      },
      error: (error) => {
        console.error('Error loading top publishers:', error);
      }
    });
  }

  // Dashboard utility methods
  getColor(index: number): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[index % colors.length];
  }

  getPercentage(count: number): number {
    const total = this.categoryData.reduce((sum, item) => sum + item.count, 0);
    return Math.round((count / total) * 100);
  }

  getConicGradient(): string {
    const total = this.categoryData.reduce((sum, item) => sum + item.count, 0);
    let gradient = '';
    let currentAngle = 0;

    this.categoryData.forEach((item, index) => {
      const angle = (item.count / total) * 360;
      const color = this.getColor(index);
      gradient += `${color} ${currentAngle}deg ${currentAngle + angle}deg, `;
      currentAngle += angle;
    });

    return gradient.slice(0, -2);
  }

  generateMonthlyData(): void {
    const monthlyCounts: { [key: string]: number } = {};

    this.articles.forEach(article => {
      if (article.DateSubmitted) {
        const date = new Date(article.DateSubmitted);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });

    this.monthlyData = Object.keys(monthlyCounts)
      .sort()
      .slice(-6)
      .map(key => ({
        month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthlyCounts[key]
      }));
  }

  getPostedAgo(createdAt: string | Date): string {
    if (!createdAt) return 'Unknown date';

    const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 1) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }

}
