import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ApiService } from '../../services/api';

interface PendingItem {
  selected: boolean;
  id: number;
  title: string;
  url: string;
  authorName: string;
  authorEmail: string;
  categoryName: string;
  action: string;
}

@Component({
  selector: 'app-approve-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-urls.html',
  styleUrls: ['./approve-urls.css']
})
export class ApproveUrlsComponent implements OnInit {
  pending: PendingItem[] = [];
  successMessage = '';
  error = '';
  allSelected = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPendingUrls();
  }

  loadPendingUrls() {
    this.apiService.getPendingUrls().subscribe({
      next: (data) => {
        this.pending = data.map(item => ({
          selected: false,
          id: item.articleIds[0], // Assuming first id
          title: item.title,
          url: item.url,
          authorName: '', // Assuming not provided, or adjust based on backend
          authorEmail: '',
          categoryName: '', // Assuming not provided
          action: item.action
        }));
      },
      error: (err) => {
        console.error('Error loading pending URLs:', err);
      }
    });
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allSelected = isChecked;
    this.pending.forEach(item => item.selected = isChecked);
  }

  trackByFn(index: number, item: PendingItem): any {
    return item.title; // or any unique identifier
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
}