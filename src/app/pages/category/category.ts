import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category-form',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
  standalone: true,
  imports: [FormsModule]
})
export class category implements OnInit {
  category: Partial<Category> = { categoryName: '', categoryDescription: '' };
  isEdit = false;
  id: number | null = null;

  constructor(
    public categoryService: CategoryService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.categoryService.getById(this.id).subscribe(data => {
        this.category = data;
      });
    }
  }

  // saveCategory() {
  //   console.log("Saving category:", this.category);
  //   if (this.isEdit && this.id) {
  //     this.categoryService.update(this.id, this.category).subscribe(() => {
  //       this.router.navigate(['/categories']);
  //     });
  //   } else {
  //     this.categoryService.create(this.category).subscribe(() => {
  //       this.router.navigate(['/categories']);
  //     });
  //   }
  // }

  saveCategory() {
  console.log("Sending category:", this.category);

  if (this.isEdit && this.id) {
    this.categoryService.update(this.id, this.category).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: err => console.error("Update failed", err)
    });
  } else {
    this.categoryService.create(this.category).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: err => console.error("Create failed", err)
    });
  }
}




}
