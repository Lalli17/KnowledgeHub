import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class category implements OnInit {
  category: Partial<Category> = { categoryName: '', categoryDescription: '' };
  isEdit = false;
  id: number | null = null;

  constructor(
    public categoryService: CategoryService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.categoryService.getById(this.id).subscribe(data => {
        this.category = data;
      });
    }
  }

  saveCategory() {
    console.log("Sending category:", this.category);

    if (this.isEdit && this.id) {
      // Update flow
      this.categoryService.update(this.id, this.category).subscribe({
        next: () => {
          alert("✅ Category updated successfully!");
          this.router.navigate(['/category/list']);
        },
        error: err => {
          console.error("Update failed", err);
          alert("❌ Failed to update category. Please try again.");
        }
      });
    } else {
      // ✅ Before creating, check if category exists
      this.categoryService.checkExists(this.category.categoryName ?? '').subscribe({
        next: (exists) => {
          if (exists) {
            alert("⚠️ Category already exists. Please choose another name.");
          } else {
            this.categoryService.create(this.category).subscribe({
              next: () => {
                alert("✅ Category created successfully!");
                this.router.navigate(['/category/list']);
              },
              error: err => {
                console.error("Create failed", err);
                alert("❌ Failed to create category. Please try again.");
              }
            });
          }
        },
        error: err => {
          console.error("Existence check failed", err);
          alert("❌ Could not verify if category exists. Please try again.");
        }
      });
    }
  }
}