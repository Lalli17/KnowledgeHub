import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
