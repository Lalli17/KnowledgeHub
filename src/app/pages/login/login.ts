import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // <-- add ReactiveFormsModule here
  templateUrl: './login.html'
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  submit() {
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = err?.error?.message || 'Login failed'
    });
  }
}
