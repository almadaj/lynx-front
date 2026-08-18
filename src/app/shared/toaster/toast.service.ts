import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../models/toast.model';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    readonly toast = signal<Toast | null>(null);
    private timeout?: ReturnType<typeof setTimeout>;

    show(message: string, type: ToastType = 'success', duration = 5000) {
        clearTimeout(this.timeout);

        this.toast.set({
            message,
            type,
            duration,
        });

        this.timeout = setTimeout(() => {
            this.toast.set(null);
        }, duration);
    }

    success(message: string, duration = 5000) {
        this.show(message, 'success', duration);
    }

    warning(message: string, duration = 5000) {
        this.show(message, 'warning', duration);
    }

    error(message: string, duration = 5000) {
        this.show(message, 'error', duration);
    }

    close() {
        clearTimeout(this.timeout);
        this.toast.set(null);
    }
}