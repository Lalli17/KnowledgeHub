import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  selectedPublisher: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  // We inject our ApiService so we can use it to make HTTP calls

  constructor(private apiService: ApiService, private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Handle query parameters for filters
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryName = params['category'] || '';
      this.selectedPublisher = params['publisher'] || '';
      if (params['status'] === 'approved') {
        this.selectedCategoryName = '';
        this.selectedPublisher = '';
      }
      this.onFilterChange(); // Update pagination after setting filters
    });

    this.apiService.browseUrls().subscribe({
      next: (data) => {
        this.articles = data ?? [];
        this.calculateTotalPages();
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
    const pub = this.selectedPublisher;
    return this.articles.filter(a => {
      const matchesCategory = cat ? a.categoryName === cat : true;
      const matchesPublisher = pub ? a.postedBy === pub : true;
      const matchesSearch = term
        ? (a.title?.toLowerCase().includes(term) || a.description?.toLowerCase().includes(term))
        : true;
      return matchesCategory && matchesPublisher && matchesSearch;
    });
  }

  // Get paginated articles
  get paginatedArticles(): BrowseUrl[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }

  // Calculate total pages based on filtered articles
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Get page numbers for pagination display with ellipsis
  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    
    if (this.totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (this.currentPage <= 4) {
        // Show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        // Show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  // Handle filter changes
  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filters change
    this.calculateTotalPages();
  }

  // Helper method for template
  getMathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Helper method to handle page navigation with type safety
  navigateToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
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

  // Get unique publishers for the select dropdown
  get uniquePublishers(): string[] {
    return [...new Set(this.articles.map(a => a.postedBy).filter(p => p))].sort();
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
