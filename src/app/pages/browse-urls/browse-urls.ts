import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, BrowseUrl } from '../../services/api';

@Component({
  selector: 'app-browse-urls',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse-urls.html',
  styleUrls: ['./browse-urls.css']
})
export class BrowseUrls implements OnInit {
  // Articles & state
  articles: BrowseUrl[] = [];
  isLoading = true;
  error: string | null = null;

  // Filters
  categories: { id: number; categoryName: string }[] = [];
  selectedCategoryName: string = '';
  searchTerm: string = '';

  // Rating & review
  selectedArticle: BrowseUrl | null = null;
  selectedRating: number = 0;
  reviewText: string = '';
  ratingModalOpen = false;
  reviewModalOpen = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Load articles
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

    // Load categories
    this.apiService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  // ----------------- Filters -----------------
  get filteredArticles(): BrowseUrl[] {
    const term = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategoryName;
    return this.articles.filter(a => {
      const matchesCategory = cat ? a.categoryName === cat : true;
      const matchesSearch = term
        ? (a.title?.toLowerCase().includes(term) ||
           a.description?.toLowerCase().includes(term))
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  // ----------------- Modals -----------------
  openRatingModal(article: BrowseUrl) {
    this.selectedArticle = article;
    this.selectedRating = 0;
    this.ratingModalOpen = true;
  }

  openReviewModal(article: BrowseUrl) {
    this.selectedArticle = article;
    this.reviewText = '';
    this.reviewModalOpen = true;
  }

  // ----------------- Submit actions -----------------
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

  // ----------------- Helpers for template -----------------
  postedBy(article: BrowseUrl): string {
    return article?.postedBy ?? 'Anonymous';
  }
}
