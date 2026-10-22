
import { Injectable, inject } from '@angular/core';
import { ToastService } from '../../../shared/toaster/toast.service';
import { environment } from '../../../environments/environment';

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
    private eventSource: EventSource | null = null;

    private apiUrl = `${environment.apiUrl}/api/notifications/stream`;
    start(): void {
        if (this.eventSource) {
            return;
        }

        this.eventSource = new EventSource(
            this.apiUrl,
            { withCredentials: true },
        );

        this.eventSource.addEventListener('class-created', (event) => {
            const messageEvent = event as MessageEvent<string>;

            try {
                const data: ClassCreatedEvent = JSON.parse(
                    messageEvent.data,
                );

                this.toastService.success(
                    `RabbitMQ hablou: ${data.name}`,
                );
            } catch {
                console.error(
                    'Não foi possível interpretar a notificação recebida.',
                );
            }
        });

        this.eventSource.onerror = () => {
            // O EventSource tenta reconectar automaticamente.
            // Não exibimos um toast a cada falha de conexão.
        };
    }

    stop(): void {
        this.eventSource?.close();
        this.eventSource = null;
    }
}
