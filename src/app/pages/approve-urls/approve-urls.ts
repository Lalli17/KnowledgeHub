import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ApiService } from '../../services/api';

interface PendingUrl {
  id: number;
  title: string;
  url: string;
  authorName?: string;
  authorEmail?: string;
  categoryName?: string;
  action?: string;
  dateSubmitted?: string;
}

@Component({
  selector: 'app-approve-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-urls.html',
  styleUrls: ['./approve-urls.css']
})
export class ApproveUrlsComponent implements OnInit {
  pending: (PendingUrl & { selected?: boolean })[] = [];
  successMessage = '';
  error = '';
  allSelected = false;

  get anySelected() {
    return this.pending?.some(p => !!p.selected) ?? false;
  }

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPendingUrls();
  }

  loadPendingUrls() {
    this.apiService.getPendingUrls().subscribe({
      next: (p) => {
        // Map possible backend field names to our UI model and add `selected`
        this.pending = p.map(item => ({
          id: item.articleIds ? item.articleIds[0] : 0,
          title: item.title,
          url: item.url,
          authorName: (item as any).authorName || '',
          authorEmail: (item as any).authorEmail || '',
          categoryName: ((item as any).categoryName ?? (item as any).category?.categoryName ?? (item as any).CategoryName) || '',
          action: item.action,
          dateSubmitted: (item as any).dateSubmitted ?? (item as any).submittedOn ?? (item as any).DateSubmitted,
          selected: false,
        }));
        this.allSelected = false;
      },
      error: (err) => {
        console.error('Error loading pending URLs:', err);
        this.error = 'Failed to load pending URLs.';
      }
    });
  }

  // --- Bulk selection ---
  toggleAll(event: any) {
    const checked = event.target.checked;
    this.allSelected = checked;
    this.pending.forEach(item => (item.selected = checked));
  }

  trackByFn(index: number, item: PendingUrl & { selected?: boolean }) {
    return item.id;
  }

  bulkApprove() {
    this.successMessage = '';
    this.error = '';
    const selectedItems = this.pending.filter(p => p.selected);
    if (selectedItems.length === 0) {
      this.error = 'No items selected for approval.';
      return;
    }
    const articleIds = selectedItems.map(item => item.id);
    this.apiService.reviewUrls({ articleIds, action: 'Approve' }).subscribe({
      next: () => {
        this.successMessage = 'Selected URLs approved!';
        this.loadPendingUrls(); // Reload the list
        // EmailJS integration for approval
        selectedItems.forEach(item => {
          const authorParams = {
            title: item.title,
            url: item.url,
            author_name: item.authorName,
            email: item.authorEmail,
            status: 'approved'
          };
          emailjs.send(
            'service_11muu58',         // Service ID
            'template_l6n2h4i',        // Author template ID
            authorParams,
            'cUMIAU-wWfWG8eTnT'        // Public key
          ).catch(err => console.error('EmailJS error:', err));
        });
      },
      error: (err) => {
        console.error('Approval error:', err);
        this.error = 'Failed to approve URLs.';
      }
    });
  }

  bulkReject() {
    this.successMessage = '';
    this.error = '';
    const selectedItems = this.pending.filter(p => p.selected);
    if (selectedItems.length === 0) {
      this.error = 'No items selected for rejection.';
      return;
    }
    const articleIds = selectedItems.map(item => item.id);
    this.apiService.reviewUrls({ articleIds, action: 'Reject' }).subscribe({
      next: () => {
        this.successMessage = 'Selected URLs rejected!';
        this.loadPendingUrls(); // Reload the list
        // EmailJS integration for rejection
        selectedItems.forEach(item => {
          const authorParams = {
            title: item.title,
            url: item.url,
            author_name: item.authorName,
            email: item.authorEmail,
            status: 'rejected'
          };
          emailjs.send(
            'service_11muu58',         // Service ID
            'template_l6n2h4i',        // Author template ID
            authorParams,
            'cUMIAU-wWfWG8eTnT'        // Public key
          ).catch(err => console.error('EmailJS error:', err));
        });
      },
      error: (err) => {
        console.error('Rejection error:', err);
        this.error = 'Failed to reject URLs.';
      }
    });
  }

  // Format a date as relative time like "5 minutes ago"
  timeAgo(dateIso: string | Date): string {
    const past = new Date(dateIso).getTime();
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