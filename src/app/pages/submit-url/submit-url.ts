import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { CategoryService, Category } from '../../services/category.service';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-submit-url',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submit-url.html',
  styleUrls: ['./submit-url.css']
})
export class SubmitUrlComponent implements OnInit {
  model = { title: '', url: '', description: '', categoryId: 0, authorName: '', authorEmail: '' };
  categories: Category[] = [];
  isLoading = false;
  successMessage = '';
  error = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    // ...your existing submit logic (e.g., API call to save URL)...

    // EmailJS integration - send to admin
    const adminParams = {
      title: this.model.title,
      url: this.model.url,
      description: this.model.description,
      category: this.model.categoryId,
      author_name: this.model.authorName,
      author_email: this.model.authorEmail
    };

    emailjs.send(
      'service_11muu58',         // Service ID
      'template_ylv9ay6',        // Admin template ID
      adminParams,
      'cUMIAU-wWfWG8eTnT'        // Public key
    ).then(() => {
      this.successMessage = 'Submitted and notification sent to admin!';
      this.isLoading = false;
      this.error = '';
      this.model = { title: '', url: '', description: '', categoryId: 0, authorName: '', authorEmail: '' };
    }, (err) => {
      this.error = 'Submission succeeded but email failed.';
      this.isLoading = false;
    });
  }
}
