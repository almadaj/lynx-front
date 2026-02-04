import { Routes } from '@angular/router';

export const routes: Routes = [
    // Login (sem sidebar)
    {
        path: '',
        loadComponent: () =>
            import('./features/home/login-page/login-page')
                .then(m => m.LoginPage)
    },
    {
        path: '',
        loadComponent: () =>
            import('./shared/sidebar/dashboard-layout')
                .then(m => m.DashboardLayout),
        children: [
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
            },
            {
                path: 'my-company',
                loadComponent: () =>
                    import('./features/company/company')
                        .then(m => m.Company)
            }
        ]
    }
];
