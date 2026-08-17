import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    templateUrl: './unauthorized.html',
    styleUrl: './unauthorized.scss',
})
export class Unauthorized {
    constructor(private router: Router) { }

    goToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    goBack(): void {
        window.history.back();
    }
}