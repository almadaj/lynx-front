import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { publicGuard } from './core/guard/public.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [publicGuard],
        loadComponent: () =>
            import('./features/home/login-page/login-page')
                .then(m => m.LoginPage)
    },
    {
        path: '',
        canActivate: [authGuard],
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
            },
            {
                path: 'classes',
                loadComponent: () =>
                    import('./features/my-classes/my-classes')
                        .then(m => m.MyClasses)
            },
            {
                path: 'company/:companyId/member',
                loadComponent: () =>
                    import('./features/members/members')
                        .then(m => m.Members)
            },
            {
                path: 'company/:companyId/edit-member/:userCompanyId',
                loadComponent: () =>
                    import('./features/members/edit-member/edit-member')
                        .then(m => m.EditMember)
            }
        ]
    }
];
