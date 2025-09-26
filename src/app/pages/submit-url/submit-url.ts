import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { CategoryService, Category } from '../../services/category.service';
import { ApiService } from '../../services/api';

const emailService = {
  serviceId: 'service_njctvj4',
  templateIdUser: 'template_kjqtvr9',
  templateIdAdmin: 'template_hmceqqs',
  publicKey: 'L4hweapiMjnerKZA0'
};

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

  constructor(private categoryService: CategoryService, private apiService: ApiService) {}

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
    this.apiService.submitUrl(this.model).subscribe({
      next: () => {
        this.successMessage = 'URL submitted successfully!';
        this.isLoading = false;
        this.error = '';

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
          emailService.serviceId,
          emailService.templateIdAdmin,
          adminParams,
          emailService.publicKey
        ).catch(err => console.error('EmailJS error:', err));

        this.model = { title: '', url: '', description: '', categoryId: 0, authorName: '', authorEmail: '' };
      },
      error: (err) => {
        console.error('Submission error:', err);
        this.error = 'Failed to submit URL.';
        this.isLoading = false;
      }
    });
  }
}
