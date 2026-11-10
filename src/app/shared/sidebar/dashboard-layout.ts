import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Sidebar } from './sidebar';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NotificationStreamService } from '../../services/events/notification/notification-stream.service';
import { NotificationService } from '../../services/api-services/notification.service';


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
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: notifications => {
        this.notificationService.setNotifications(notifications)
      },
      error: error => {
        console.error('Erro ao carregar notificações', error)
      },
    })
    this.notificationStream.start();
  }

  ngOnDestroy(): void {
    this.notificationStream.stop();
  }

}
