import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, User } from '../../services/api'; // Correct the path to your service

@Component({
  selector: 'app-list-users',
  standalone: true, // Make it standalone
  imports: [CommonModule], // Import CommonModule
  templateUrl: './list-users.html',
  styleUrl: './list-users.css'
})
export class ListUsers implements OnInit {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.listUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. You may not have admin rights.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}