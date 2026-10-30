
import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { NotificationService } from '../../services/api-services/notification.service'

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [DatePipe, MatIconModule],
    templateUrl: './notifications-page.html',
    styleUrl: './notifications-page.scss',
})
export class NotificationsPage implements OnInit {
    protected readonly notificationService = inject(NotificationService)

    readonly filter = signal<'all' | 'unread'>('all')
    readonly loading = signal(true)
    readonly error = signal(false)

    readonly filteredNotifications = computed(() => {
        const notifications = this.notificationService.notifications()

        if (this.filter() === 'unread') {
            return notifications.filter(
                notification => notification.readAt === null,
            )
        }

        return notifications
    })

    ngOnInit(): void {
        this.loadNotifications()
    }

    loadNotifications(): void {
        this.loading.set(true)
        this.error.set(false)

        this.notificationService.getMyNotifications().subscribe({
            next: notifications => {
                this.notificationService.setNotifications(notifications)
                this.loading.set(false)
            },
            error: () => {
                this.error.set(true)
                this.loading.set(false)
            },
        })
    }

    markAsRead(id: string): void {
        console.log('Clicou em marcar como lida:', id)

        const notification = this.notificationService
            .notifications()
            .find(item => item.id === id)

        if (!notification || notification.readAt !== null) {
            console.log('Notificação não encontrada ou já lida')
            return
        }

        this.notificationService.markNotificationAsRead(id).subscribe({
            next: () => {
                console.log('Backend confirmou a leitura')
                this.notificationService.markAsRead(id)
            },
            error: error => {
                console.error('Erro ao marcar como lida:', error)
            },
        })
    }
}
