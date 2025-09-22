import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-urls',
  standalone: true, // <-- THIS IS THE FIX
  imports: [CommonModule],
  templateUrl: './approve-urls.html',
})
export class ApproveUrlsComponent implements OnInit {
  pending: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getPendingUrls().subscribe(p => this.pending = p);
  }

  // The code below will now work because ApiService has these methods again
  approve(id: number) {
    this.api.approveUrl(id).subscribe(() => this.load());
  }

  reject(id: number) {
    this.api.rejectUrl(id).subscribe(() => this.load());
  }
}