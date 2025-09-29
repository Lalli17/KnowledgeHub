import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import emailjs from '@emailjs/browser';
import { ApiService } from '../../services/api';


interface PendingUrl {
  id: number;
  title: string;
  url: string;
  authorName?: string;
  authorEmail?: string;
  categoryName?: string;
  action?: string; // Pending / Approve / Reject
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

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      if (status === 'pending') {
        this.loadPendingUrls();
      } else {
        this.loadPendingUrls(); // default to pending
      }
    });
  }

  loadPendingUrls() {
    this.apiService.getPendingUrls().subscribe({
      next: (p) => {
        this.pending = p.map(item => {
          const anyItem: any = item as any;
          const name = (
            anyItem.postedBy ??
            anyItem.authorName ??
            anyItem.submittedBy ??
            anyItem.userName ??
            anyItem.author?.name ??
            anyItem.createdBy?.name ??
            ''
          );
          const email = (
            anyItem.authorEmail ??
            anyItem.email ??
            anyItem.author?.email ??
            anyItem.createdBy?.email ??
            ''
          );
          return {
            id: item.articleIds ? item.articleIds[0] : 0,
            title: item.title,
            url: item.url,
            authorName: String(name).trim(),
            authorEmail: String(email).trim(),
            categoryName: ((anyItem.categoryName ?? anyItem.category?.categoryName ?? anyItem.CategoryName) || ''),
            action: item.action || 'Pending',
            dateSubmitted: (anyItem.dateSubmitted ?? anyItem.submittedOn ?? anyItem.DateSubmitted),
            selected: false,
          };
        });
        this.allSelected = false;
      },
      error: (err) => {
        console.error('Error loading pending URLs:', err);
        this.error = 'Failed to load pending URLs.';
      }
    });
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.allSelected = checked;
    this.pending.forEach(item => (item.selected = checked));
  }

  trackByFn(index: number, item: PendingUrl & { selected?: boolean }) {
    return item.id;
  }

  approveSingle(item: PendingUrl & { selected?: boolean }) {
    item.selected = true;
    this.bulkApprove();
  }

  rejectSingle(item: PendingUrl & { selected?: boolean }) {
    item.selected = true;
    this.bulkReject();
  }

  bulkApprove() {
    this.processBulk('Approve', 'Selected URLs approved!');
  }

  bulkReject() {
    this.processBulk('Reject', 'Selected URLs rejected!');
  }

  private processBulk(action: 'Approve' | 'Reject', successMsg: string) {
    this.successMessage = '';
    this.error = '';
    const selectedItems = this.pending.filter(p => p.selected);
    if (selectedItems.length === 0) {
      this.error = `No items selected for ${action.toLowerCase()}.`;
      return;
    }
    const articleIds = selectedItems.map(item => item.id);
    this.apiService.reviewUrls({ articleIds, action }).subscribe({
      next: () => {
        selectedItems.forEach(item => item.action = action); // Update UI instantly
        this.successMessage = successMsg;
        this.loadPendingUrls(); // reload fresh list if needed
      },
      error: (err) => {
        console.error(`${action} error:`, err);
        this.error = `Failed to ${action.toLowerCase()} URLs.`;
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
