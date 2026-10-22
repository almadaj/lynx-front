import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Sidebar } from './sidebar';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NotificationStreamService } from '../../services/events/notification/notification-stream.service';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar, MatIconModule],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './sidebar.scss',
})
export class DashboardLayout implements OnInit, OnDestroy {
  private readonly notificationStream = inject(NotificationStreamService);

  ngOnInit(): void {
    this.notificationStream.start();
  }

  ngOnDestroy(): void {
    this.notificationStream.stop();
  }

}
