import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, BrowseUrl } from '../../services/api';
import { AuthService } from '../../services/auth';

declare var bootstrap: any;

@Component({
  selector: 'app-browse-urls',
  standalone: true,

  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse-urls.html',
  styleUrls: ['./browse-urls.css']
})
export class BrowseUrls implements OnInit {
  articles: BrowseUrl[] = [];
  isLoading = true;
  error: string | null = null;
  selectedArticle: BrowseUrl | null = null;
  selectedRating: number = 0;
  reviewText: string = '';
  // Track which article descriptions are expanded
  private expandedArticleIds = new Set<number>();

   // ✅ Add these two properties for Angular-only modals
  ratingModalOpen = false;
  reviewModalOpen = false;


  // Filters
  categories: { id: number; categoryName: string }[] = [];
  selectedCategoryName: string = '';
  searchTerm: string = '';

  // We inject our ApiService so we can use it to make HTTP calls

  constructor(private apiService: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.browseUrls().subscribe({
      next: (data) => {
        this.articles = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load articles. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching articles:', err);
      }
    });

    // Load categories for filter dropdown on init
    this.apiService.getCategories().subscribe({
      next: (cats) => (this.categories = cats || []),
      error: () => {}
    });
  }

  // Modal functions
  private ensureLoggedIn(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    const returnUrl = this.router.url || '/browse';
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }

  openRatingModal(article: BrowseUrl) {
  if (!this.ensureLoggedIn()) { return; }
  this.selectedArticle = article;
  this.selectedRating = 0;
  this.ratingModalOpen = true;
}

openReviewModal(article: BrowseUrl) {
  if (!this.ensureLoggedIn()) { return; }
  this.selectedArticle = article;
  this.reviewText = '';
  this.reviewModalOpen = true;
}


  submitRating() {
    if (!this.selectedArticle || !this.selectedRating) return;

    this.apiService.submitRating(this.selectedArticle.id, this.selectedRating).subscribe({
      next: () => {
        alert('Rating submitted successfully!');
        location.reload();
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating.');
      }
    });

    // Load categories for filter dropdown
    this.apiService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => {}
    });
  }

  // Derived list applying filters and search
  get filteredArticles(): BrowseUrl[] {
    const term = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategoryName;
    return this.articles.filter(a => {
      const matchesCategory = cat ? a.categoryName === cat : true;
      const matchesSearch = term
        ? (a.title?.toLowerCase().includes(term) || a.description?.toLowerCase().includes(term))
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  submitReview() {
    if (!this.selectedArticle || !this.reviewText.trim()) return;

    this.apiService.submitReview(this.selectedArticle.id, this.reviewText).subscribe({
      next: () => {
        alert('Review submitted successfully!');
        location.reload();
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review.');
      }
    });
  }

  // ---------- Safe getters for template ----------
  get selectedArticleTitle(): string {
    return this.selectedArticle?.title ?? '';
  }

  reviews(article: BrowseUrl): any[] {
    return article?.reviews ?? [];
  }

  ratingsCount(article: BrowseUrl): number {
    return article?.ratingsCount ?? 0;
  }

  averageRating(article: BrowseUrl): number {
    return article?.averageRating ?? 0;
  }

  postedBy(article: BrowseUrl): string {
    return article?.postedBy ?? 'Anonymous';
  }

  // UI helpers for description expand/collapse
  isExpanded(article: BrowseUrl): boolean {
    return this.expandedArticleIds.has(article.id);
  }

  toggleExpanded(article: BrowseUrl): void {
    if (this.isExpanded(article)) {
      this.expandedArticleIds.delete(article.id);
    } else {
      this.expandedArticleIds.add(article.id);
    }
  }

  // Show toggle only if description likely exceeds 5 lines
  shouldShowToggle(article: BrowseUrl): boolean {
    const textLength = article?.description?.length ?? 0;
    // Heuristic: ~70 chars per line x 5 lines = 350
    return textLength > 350;
  }
}
