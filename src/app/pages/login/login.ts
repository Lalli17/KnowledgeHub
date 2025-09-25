import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule,ReactiveFormsModule] // <-- Add CommonModule here if needed
})
export class LoginComponent {
  loading = false;
  error = '';

  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email ?? '', password ?? '').subscribe({
      next: (res: any) => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/approve-urls']);
        } else {
          this.router.navigate(['/submit-url']);
        }
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
