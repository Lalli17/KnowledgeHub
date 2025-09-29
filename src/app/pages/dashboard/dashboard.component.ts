import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService, ReviewArticleDto } from '../../services/dashboard.service';
import { NotificationService } from '../../services/notification.service';
import { ApiService } from '../../services/api';
import { ArticleMetrics } from '../../modules/dashboard/models/article-metrics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  articles: ArticleMetrics[] = [];
  recentActivities: any[] = [];
  recentArticles: ArticleMetrics[] = [];
  monthlyData: any[] = [];
  topPublishers: any[] = [];
  approvedArticlesCount: number = 0;
  pendingArticlesCount: number = 0;
  rejectedArticlesCount: number = 0;
  ratedArticlesCount: number = 0;
  averageRating: number = 0;
  categoryData: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApprovedArticlesCount();
    this.loadPendingArticlesCount();
    this.loadRejectedArticlesCount();
    this.loadRatedArticlesCount();
    this.loadAverageRating();
    this.loadCategoryData();
    this.loadTopPublishers();
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
          // Normalize both dates to start of day for accurate comparison
          const normalizedArticleDate = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate());
          return normalizedArticleDate >= today;
        });

        // Sort articles by DateSubmitted (most recent first) and take top 10
        this.recentArticles = this.articles
          .filter(article => article.DateSubmitted)
          .sort((a, b) => new Date(b.DateSubmitted!).getTime() - new Date(a.DateSubmitted!).getTime())
          .slice(0, 10);

        // Generate monthly data from articles
        this.generateMonthlyData();

        // Debug: Log the filtered articles to check if any are being filtered
        console.log('Recent Activities:', this.recentActivities);
        console.log('Recent Articles:', this.recentArticles);
        console.log('All Articles:', this.articles);
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
        this.categoryData = data;
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
        console.log('Top Publishers:', this.topPublishers);
      },
      error: (error) => {
        console.error('Error loading top publishers:', error);
      }
    });
  }

  navigateToCategory(category: string): void {
    this.router.navigate(['/browse'], { queryParams: { category } });
  }

  navigateToPublisher(publisher: string): void {
    this.router.navigate(['/browse'], { queryParams: { publisher } });
  }

  navigateToApproved(): void {
    this.router.navigate(['/browse'], { queryParams: { status: 'approved' } });
  }

  navigateToPending(): void {
    this.router.navigate(['/review'], { queryParams: { status: 'pending' } });
  }

  navigateToRejected(): void {
    this.router.navigate(['/rejected-urls']);
  }

  getColor(index: number): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[index % colors.length];
  }

  getRotation(index: number): number {
    const total = this.categoryData.reduce((sum, item) => sum + item.count, 0);
    let rotation = 0;
    for (let i = 0; i < index; i++) {
      rotation += (this.categoryData[i].count / total) * 360;
    }
    return rotation;
  }

  getSkew(index: number): number {
    const total = this.categoryData.reduce((sum, item) => sum + item.count, 0);
    const angle = (this.categoryData[index].count / total) * 360;
    return 90 - (angle / 2);
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

    return gradient.slice(0, -2); // Remove trailing comma
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
      .slice(-6) // Last 6 months
      .map(key => ({
        month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthlyCounts[key]
      }));
  }

  getBarHeight(count: number): number {
    const maxCount = Math.max(...this.monthlyData.map(item => item.count), 1);
    return (count / maxCount) * 200; // Max height of 200px
  }

  getMaxCount(): number {
    return Math.max(...this.monthlyData.map(item => item.count), 1);
  }

  getLinePoints(): string {
    let points = '';
    this.monthlyData.forEach((item, index) => {
      const x = index * 60 + 30;
      const y = 300 - (item.count / this.getMaxCount() * 250);
      points += `${x},${y} `;
    });
    return points.trim();
  }


}
