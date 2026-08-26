import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/api-services/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401) {
                authService.clearAuthState();

                const isAuthRequest =
                    req.url.includes('/auth/login') ||
                    req.url.includes('/auth/register') ||
                    req.url.includes('/auth/logout');

                if (!isAuthRequest) {
                    router.navigate(['/']);
                }
            }

            return throwError(() => error);
        })
    );
};