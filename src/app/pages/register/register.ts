import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule,ReactiveFormsModule] // <-- Add CommonModule here if needed
})
export class Register {
  registerForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ Define form here inside constructor
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator } // <-- form-level validator
    );
  }

  // ✅ Custom validator
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  };

  register() {
    if (this.registerForm.invalid) return;

    const { name, email, password } = this.registerForm.value; // exclude confirmPassword
    this.authService.register({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => (this.error = 'Registration failed. Try again.')
    });
  }
}
