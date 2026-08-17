import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../shared/enum/role.enum';
import { AuthService } from '../../services/api-services/auth.service';

export const roleGuard = (roles: Role[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const hasPermission = roles.some(role =>
            authService.hasPermission(role)
        );

        if (hasPermission) {
            return true;
        }

        return router.createUrlTree(['/unauthorized']);
    };
};