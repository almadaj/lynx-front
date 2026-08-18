import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule
    ],
    templateUrl: './toast.html',
    styleUrl: './toast.scss'
})
export class ToastComponent {
    readonly toastService = inject(ToastService);
}