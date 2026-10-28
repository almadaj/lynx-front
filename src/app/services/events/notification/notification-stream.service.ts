
import { Injectable, inject } from '@angular/core';
import { ToastService } from '../../../shared/toaster/toast.service';
import { environment } from '../../../environments/environment';
import { NotificationResponse } from '../../../models/notification.model';
import { AuthService } from '../../api-services/auth.service';
import { NotificationService } from '../../api-services/notification.service';

interface ClassCreatedEvent {
    classId: string;
    name: string;
    companyId: string;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationStreamService {
    private readonly toastService = inject(ToastService);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService)
    private eventSource: EventSource | null = null;

    private apiUrl = `${environment.apiUrl}/api/notifications/stream`;
    start(): void {
        if (this.eventSource) {
            return
        }

        this.eventSource = new EventSource(
            this.apiUrl,
            { withCredentials: true },
        )

        this.eventSource.addEventListener('notification', (event) => {
            const messageEvent = event as MessageEvent<string>
            try {
                const data: NotificationResponse = JSON.parse(messageEvent.data)
                this.notificationService.addNotification(data)
                this.toastService.success(
                    `${data.title}: ${data.message}`,
                )
            } catch {
                console.error(
                    'Não foi possível interpretar a notificação recebida.',
                )
            }
        })

        this.eventSource.onerror = () => {
            this.recoverConnection()
        }
    }

    stop(): void {
        this.eventSource?.close();
        this.eventSource = null;
    }

    private recoverConnection(): void {
        this.authService.me().subscribe({
            next: () => {
                this.stop()
                this.start()
            },
            error: () => {
                this.stop()
            },
        })
    }
}
