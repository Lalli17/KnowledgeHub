import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-urls',
  templateUrl: './approve-urls.html',
  imports: [CommonModule]
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

  approve(id: number) {
    this.api.approveUrl(id).subscribe(() => this.load());
  }

  reject(id: number) {
    this.api.rejectUrl(id).subscribe(() => this.load());
  }
}
