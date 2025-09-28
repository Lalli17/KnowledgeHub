import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.html',
  styleUrls: ['./list-users.css'],
  imports: [CommonModule, FormsModule]
})
export class ListUsers implements OnInit {
  users: any[] = [];
  editingUser: any = null;
  isLoading: boolean = false; // <-- Add this line
  error: string = ''; // <-- Add this line
  roles: string[] = []; // Add this property

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles(); // Fetch roles
  }

  loadUsers() {
    this.api.getUsers().subscribe(users => this.users = users);
  }

  loadRoles() {
    // If you have an API endpoint for roles, use it:
    // this.api.getRoles().subscribe(r => this.roles = r);

    // Or hardcode for now:
    this.roles = ['Admin', 'User'];
  }

  editUser(user: any) {
    this.editingUser = { ...user }; // clone to avoid direct mutation
  }

  saveUser() {
    this.api.updateUser(this.editingUser.id, this.editingUser).subscribe(() => {
      this.editingUser = null;
      this.loadUsers();
    });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}