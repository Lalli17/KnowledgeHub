// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../../services/api';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-approve-urls',
//   standalone: true, // <-- THIS IS THE FIX
//   imports: [CommonModule,FormsModule],
//   templateUrl: './approve-urls.html',
// })
// export class ApproveUrlsComponent implements OnInit {
//   pending: any[] = [];

//   constructor(private api: ApiService) {}

//   ngOnInit() {
//     this.load();
//   }

// load() {
//   this.api.getPendingUrls().subscribe(p => this.pending = p);
// }

// // loadByCategory(id: number) {
// //   this.api.getPendingUrls(id).subscribe(p => this.pending = p);
// // }


//   // The code below will now work because ApiService has these methods again
//   approve(id: number) {
//     this.api.approveUrl(id).subscribe(() => this.load());
//   }

//   reject(id: number) {
//     this.api.rejectUrl(id).subscribe(() => this.load());
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ApiService, PendingUrl } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-urls.html',
})
export class ApproveUrlsComponent implements OnInit {
  pending: (PendingUrl & { selected?: boolean })[] = [];

  get anySelected() {
    return this.pending?.some(p => !!p.selected);
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getPendingUrls().subscribe(p => {
      // Map possible backend field names to our UI model and add `selected`
      this.pending = p.map(item => ({
        ...item,
        // normalize possible variants if backend uses different casings
        categoryName: (item as any).categoryName ?? (item as any).category?.categoryName ?? (item as any).CategoryName,
        dateSubmitted: (item as any).dateSubmitted ?? (item as any).submittedOn ?? (item as any).DateSubmitted,
        status: (item as any).status ?? (item as any).Status ?? item.action,
        selected: false,
      }));
    });
  }

  // --- Bulk selection ---
  toggleAll(event: any) {
    const checked = event.target.checked;
    this.pending.forEach(item => (item.selected = checked));
  }

  bulkApprove() {
    const ids = this.pending.filter(p => p.selected).map(p => p.articleIds[0]);
    if (ids.length > 0) {
      this.api.reviewUrls({ articleIds: ids, action: 'Approve' })
        .subscribe(() => this.load());
    }
  }

  bulkReject() {
    const ids = this.pending.filter(p => p.selected).map(p => p.articleIds[0]);
    if (ids.length > 0) {
      this.api.reviewUrls({ articleIds: ids, action: 'Reject' })
        .subscribe(() => this.load());
    }
  }

  // --- Single Approve/Reject (still available) ---
  approve(id: number) {
    this.api.approveUrl(id).subscribe(() => this.load());
  }

  reject(id: number) {
    this.api.rejectUrl(id).subscribe(() => this.load());
  }
}
