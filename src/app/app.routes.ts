import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/login-page/login-page')
                .then(m => m.LoginPage)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/home/dashboard/dashboard')
                .then(m => m.Dashboard)
    },
    {
        path: 'academy',
        loadComponent: () =>
            import('./features/home/dashboard/dashboard')
                .then(m => m.Dashboard)
    }
];
