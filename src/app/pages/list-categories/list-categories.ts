import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './list-categories.html',
  styleUrls: ['./list-categories.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ListCategories implements OnInit {
  categories: Category[] = [];
  loading = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
      }
    });
  }

  editCategory(category: Category) {
    // Navigate to edit page with the category id
    this.router.navigate(['/category/list/edit', category.id]);
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => this.loadCategories());
    }
  }

}
