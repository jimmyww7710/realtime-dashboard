import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service.ts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private socketService = inject(SocketService);
  data = this.socketService.dashboardData;

  ngOnInit() {

  }

  ngOnDestroy() {
  }
}
