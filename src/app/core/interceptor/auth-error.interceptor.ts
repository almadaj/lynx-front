import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../../services/api-services/auth.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router)

    return next(req).pipe(
        catchError(error => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (
                req.url.includes('/auth/login') ||
                req.url.includes('/auth/refresh') ||
                req.url.includes('/auth/logout')
            ) {
                return throwError(() => error);
            }

            return authService.refresh().pipe(
                switchMap(() => {
                    return next(req);
                }),
                catchError(refreshError => {
                    authService.clearAuthState();
                    router.navigate(["/"])
                    return throwError(() => refreshError);
                })
            );
        })
    );
};