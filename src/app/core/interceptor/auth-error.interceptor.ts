import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../../services/api-services/auth.service";
import { inject } from "@angular/core";

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (
                req.url.includes('/auth/login') ||
                req.url.includes('/auth/refresh')
            ) {
                return throwError(() => error);
            }

            return authService.refresh().pipe(
                switchMap(() => {
                    return next(req);
                }),
                catchError(refreshError => {
                    authService.clearAuthState();
                    return throwError(() => refreshError);
                })
            );
        })
    );
};