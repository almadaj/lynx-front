export type ToastType = 'success' | 'warning' | 'error';

export interface Toast {
    message: string;
    type: ToastType;
    duration: number;
}