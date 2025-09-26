import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardService } from '../../services/dashboard.service';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  imports: [CommonModule, DashboardComponent],
  providers: [DashboardService, NotificationService],
  exports: [DashboardComponent]
})
export class DashboardModule { }
