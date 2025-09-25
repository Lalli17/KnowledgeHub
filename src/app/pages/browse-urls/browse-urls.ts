import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// We import the service that talks to our backend
import { ApiService, BrowseUrl } from '../../services/api';

@Component({
  selector: 'app-browse-urls',
  // This component is standalone, which is the modern Angular standard
  standalone: true,
  // We need to import modules here for the template to use directives like *ngIf, *ngFor, and routerLink
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse-urls.html',
  styleUrl: './browse-urls.css'
})
export class BrowseUrls implements OnInit {
  // This array will hold the articles we fetch from the API
  articles: BrowseUrl[] = [];
  // These properties help us show loading and error messages
  isLoading = true;
  error: string | null = null;

  // Filters
  categories: { id: number; categoryName: string }[] = [];
  selectedCategoryName: string = '';
  searchTerm: string = '';

  // We inject our ApiService so we can use it to make HTTP calls
  constructor(private apiService: ApiService) {}

  // The ngOnInit lifecycle hook runs once when the component is first created
  ngOnInit(): void {
    // We call the service to get the approved URLs
    this.apiService.browseUrls().subscribe({
      next: (data) => {
        // If the API call is successful, we store the data and stop loading
        this.articles = data;
        this.isLoading = false;
      },
      error: (err) => {
        // If the API call fails, we set an error message and stop loading
        this.error = 'Failed to load articles. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching articles:', err); // Log the actual error for debugging
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
}