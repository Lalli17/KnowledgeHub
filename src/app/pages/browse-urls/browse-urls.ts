import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, BrowseUrl } from '../../services/api';
import { AuthService } from '../../services/auth';

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
  private expandedArticleIds = new Set<number>();

  ratingModalOpen = false;
  reviewModalOpen = false;
  reviewsModalOpen = false;

  categories: { id: number; categoryName: string }[] = [];
  selectedCategoryName: string = '';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private apiService: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.browseUrls().subscribe({
      next: data => { this.articles = data ?? []; this.calculateTotalPages(); this.isLoading = false; },
      error: err => { this.error = 'Failed to load articles.'; this.isLoading = false; console.error(err); }
    });

    this.apiService.getCategories().subscribe({ next: cats => this.categories = cats || [], error: () => {} });
  }

  // ---------- Modal handlers ----------
  private ensureLoggedIn(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url || '/browse' } });
    return false;
  }

  openRatingModal(article: BrowseUrl) {
    if (!this.ensureLoggedIn()) return;
    this.selectedArticle = article;
    this.selectedRating = 0;
    this.ratingModalOpen = true;
  }

  openReviewModal(article: BrowseUrl) {
    if (!this.ensureLoggedIn()) return;
    this.selectedArticle = article;
    this.reviewText = '';
    this.reviewModalOpen = true;
  }

  openReviewsModal(article: BrowseUrl) {
    this.selectedArticle = article;
    this.reviewsModalOpen = true;
  }

  submitRating() {
    if (!this.selectedArticle || !this.selectedRating) return;
    this.apiService.submitRating(this.selectedArticle.id, this.selectedRating).subscribe({
      next: updatedArticle => {
        alert('Rating submitted successfully!');
        this.selectedArticle!.averageRating = updatedArticle.averageRating;
        this.selectedArticle!.ratingsCount = updatedArticle.ratingsCount;
        this.ratingModalOpen = false;
      },
      error: err => { console.error(err); alert('Failed to submit rating.'); }
    });
  }

  submitReview() {
    if (!this.selectedArticle || !this.reviewText.trim()) return;
    this.apiService.submitReview(this.selectedArticle.id, this.reviewText).subscribe({
      next: newReview => {
        alert('Review submitted successfully!');
        this.selectedArticle!.reviews = [...(this.selectedArticle!.reviews || []), newReview];
        this.reviewText = '';
        this.reviewModalOpen = false;
      },
      error: err => { console.error(err); alert('Failed to submit review.'); }
    });
  }

  // ---------- Admin: Delete review ----------
  deleteReview(reviewId: number, index: number) {
    if (!this.auth.isAdmin()) return;
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.apiService.deleteReview(reviewId).subscribe({
      next: () => {
        alert('Review deleted successfully.');
        if (this.selectedArticle?.reviews) {
          this.selectedArticle.reviews.splice(index, 1);
        }
      },
      error: err => { console.error('Error deleting review:', err); alert('Failed to delete review.'); }
    });
  }

  // ---------- Filtering & Pagination ----------
  get filteredArticles(): BrowseUrl[] {
    const term = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategoryName;
    return this.articles.filter(a => {
      const matchesCategory = cat ? a.categoryName === cat : true;
      const matchesSearch = term ? a.title?.toLowerCase().includes(term) || a.description?.toLowerCase().includes(term) : true;
      return matchesCategory && matchesSearch;
    });
  }

  get paginatedArticles(): BrowseUrl[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredArticles.slice(start, start + this.itemsPerPage);
  }

  calculateTotalPages(): void { this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage); if (this.currentPage > this.totalPages && this.totalPages > 0) this.currentPage = 1; }
  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 7) { for (let i = 1; i <= this.totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (this.currentPage <= 4) { for (let i = 2; i <= 5; i++) pages.push(i); pages.push('...'); pages.push(this.totalPages); }
      else if (this.currentPage >= this.totalPages - 3) { pages.push('...'); for (let i = this.totalPages - 4; i <= this.totalPages; i++) pages.push(i); }
      else { pages.push('...'); for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i); pages.push('...'); pages.push(this.totalPages); }
    }
    return pages;
  }

  onFilterChange(): void { this.currentPage = 1; this.calculateTotalPages(); }
  getMathMin(a: number, b: number): number { return Math.min(a, b); }
  navigateToPage(page: number | string): void { if (typeof page === 'number') this.goToPage(page); }

  // ---------- Template helpers ----------
  reviews(article: BrowseUrl): any[] { return article?.reviews ?? []; }
  postedBy(article: BrowseUrl): string { return article?.postedBy ?? 'Anonymous'; }
  isExpanded(article: BrowseUrl): boolean { return this.expandedArticleIds.has(article.id); }
  toggleExpanded(article: BrowseUrl): void { this.isExpanded(article) ? this.expandedArticleIds.delete(article.id) : this.expandedArticleIds.add(article.id); }
  shouldShowToggle(article: BrowseUrl): boolean { return (article?.description?.length ?? 0) > 350; }
}
