import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface RejectedUrl {
  id: number;
  title: string;
  url: string;
  categoryName?: string;
  dateSubmitted?: string;
}

@Component({
  selector: 'app-rejected-urls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rejected-urls.html',
  styleUrls: ['./rejected-urls.css']
})
export class RejectedUrlsComponent implements OnInit {
  rejectedArticles: RejectedUrl[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRejectedArticles();
  }

  loadRejectedArticles(): void {
    this.apiService.getRejectedArticles().subscribe({
      next: (data) => {
        this.rejectedArticles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rejected articles:', err);
        this.error = 'Failed to load rejected articles.';
        this.isLoading = false;
      }
    });
  }

  timeAgo(dateIso?: string | Date): string {
    if (!dateIso) return 'Unknown date';
    const past = new Date(dateIso).getTime();
    if (isNaN(past)) return 'Invalid date';
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - past) / 1000)); // seconds
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }
}
