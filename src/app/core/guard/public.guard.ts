import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const publicGuard: CanActivateFn = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID)

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const token = sessionStorage.getItem('token');

    if (token) {
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};