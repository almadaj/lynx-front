import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { publicGuard } from './core/guard/public.guard';
import { roleGuard } from './core/guard/role.guard';
import { Role } from './shared/enum/role.enum';

export const routes: Routes = [
    {
        path: '',
        canActivate: [publicGuard],
        loadComponent: () =>
            import('./features/home/login-page/login-page')
                .then(m => m.LoginPage)
    },
    {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () =>
            import('./features/register/register')
                .then(m => m.Register)
    },
    {
        path: '',
        canActivate: [authGuard, roleGuard],
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
                canActivate: [roleGuard([Role.STUDENT])],
                loadComponent: () =>
                    import('./features/home/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },
            {
                path: 'unauthorized',
                loadComponent: () =>
                    import('./features/unauthorized/unauthorized')
                        .then(m => m.Unauthorized)
            },
            {
                path: 'my-company',
                canActivate: [roleGuard([Role.STUDENT])],
                loadComponent: () =>
                    import('./features/company/company')
                        .then(m => m.Company)
            },
            {
                path: 'classes',
                canActivate: [roleGuard([Role.STUDENT])],
                loadComponent: () =>
                    import('./features/my-classes/my-classes')
                        .then(m => m.MyClasses)
            },
            {
                path: 'classes/:classId',
                loadComponent: () =>
                    import('./features/view-class/view-class')
                        .then(m => m.ViewClass)
            },
            {
                path: 'notifications',
                loadComponent: () =>
                    import('./features/notification/notifications-page')
                        .then(m => m.NotificationsPage)
            },
            {
                path: 'company/:companyId/member',
                loadComponent: () =>
                    import('./features/members/members')
                        .then(m => m.Members)
            },
            {
                path: 'question',
                canActivate: [roleGuard([Role.TEACHER])],
                loadComponent: () =>
                    import('./features/question/question')
                        .then(m => m.Question)
            },
            {
                path: 'question/new',
                canActivate: [roleGuard([Role.TEACHER])],
                loadComponent: () =>
                    import('./features/question/question-create/question-create')
                        .then(m => m.QuestionCreate)
            },
            {
                path: 'question/:id/edit',
                canActivate: [roleGuard([Role.TEACHER])],
                loadComponent: () =>
                    import('./features/question/question-edit/question-edit')
                        .then(m => m.QuestionEdit)
            },
            {
                path: 'question/:id',
                canActivate: [roleGuard([Role.TEACHER])],
                loadComponent: () =>
                    import('./features/question/question-details/question-details')
                        .then(m => m.QuestionDetails)
            },
            {
                path: 'company/:companyId/edit-member/:userCompanyId',
                loadComponent: () =>
                    import('./features/members/edit-member/edit-member')
                        .then(m => m.EditMember),
                canActivate: [roleGuard([Role.HEADTEACHER])]
            }
        ]
    }
];
