import { HttpInterceptorFn } from '@angular/common/http';
//TODO: DEPRECATED
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({
        withCredentials: true
    }));
};