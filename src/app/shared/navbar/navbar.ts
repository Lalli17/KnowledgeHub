import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  // Inject the Router along with the AuthService
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    // After logging out, navigate the user to the home page
    this.router.navigate(['/']);
  }
}