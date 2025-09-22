import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // We must import FormsModule to use ngModel in the template
import { RouterModule } from '@angular/router';

// Import our service and the data models it uses
import { ApiService, Category, SubmitUrlPayload } from '../../services/api';

@Component({
  selector: 'app-submit-url',
  // This component is standalone
  standalone: true,
  // We need CommonModule for *ngIf/*ngFor, and FormsModule for the form
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './submit-url.html',
  styleUrl: './submit-url.css'
})
export class SubmitUrl implements OnInit {
  // This array will hold the categories for the dropdown
  categories: Category[] = [];

  // Properties to manage UI state (loading, errors, success)
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // The 'model' object is bound to our form fields using ngModel
  model: SubmitUrlPayload = {
    title: '',
    url: '',
    description: '',
    categoryId: 0, // Default to 0, which is an invalid/placeholder selection
  };

  constructor(private apiService: ApiService) {}

  // When the component loads, fetch the list of categories for the dropdown
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.error = 'Could not load categories. You may need to log in as an Admin to create some first.';
        console.error('Error fetching categories:', err);
      }
    });
  }

  // This function is called when the form is submitted
  onSubmit(): void {
    // Basic validation
    if (this.model.categoryId === 0) {
      this.error = 'Please select a category.';
      return;
    }

    // Reset UI state before making the API call
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    this.apiService.submitUrl(this.model).subscribe({
      next: () => {
        this.successMessage = 'URL submitted successfully! It will be reviewed by an admin.';
        this.isLoading = false;
        // Reset the form to its initial state for another submission
        this.model = { title: '', url: '', description: '', categoryId: 0 };
      },
      error: (err) => {
        this.error = 'Submission failed. Please check your input and try again.';
        this.isLoading = false;
        console.error('Error submitting URL:', err);
      }
    });
  }
}