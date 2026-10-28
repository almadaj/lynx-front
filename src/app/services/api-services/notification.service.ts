import { computed, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NotificationResponse } from "../../models/notification.model";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/api/notifications`;
    private readonly _notifications = signal<NotificationResponse[]>([])
    readonly notifications = this._notifications.asReadonly()

    constructor(
        private http: HttpClient,
    ) { }

    getMyNotifications(): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.apiUrl}`)
    }

    markAsRead(id: string): void {
        this.http.post(`${this.apiUrl}/${id}/read`, {})
    }

    readonly unreadCount = computed(
        () => this._notifications().filter(
            notification => notification.readAt === null,
        ).length,
    )

    addNotification(notification: NotificationResponse): void {
        this._notifications.update(notifications => [
            notification,
            ...notifications,
        ])
    }

    setNotifications(notifications: NotificationResponse[]): void {
        this._notifications.set(notifications)
    }

    // markAsRead(id: string): void {
    //     this._notifications.update(notifications =>
    //         notifications.map(notification =>
    //             notification.id === id
    //                 ? { ...notification, readAt: new Date().toISOString() }
    //                 : notification,
    //         ),
    //     )
    // }
}