import { computed, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO } from '../../models/auth.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthUser } from '../../models/user.model';
import { Role, RoleHelper } from '../../shared/enum/role.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _user = signal<AuthUser | null>(null);
    readonly user = this._user.asReadonly();
    private readonly platformId = inject(PLATFORM_ID);

    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    readonly companies = computed(() =>
        this.user()?.companies ?? []
    );

    private readonly _currentCompanyId = signal<string | null>(null);

    readonly currentCompany = computed(() => {
        const companies = this.companies();
        const companyId = this._currentCompanyId();

        if (!companyId) {
            return companies[0] ?? null;
        }

        return companies.find(
            company => company.companyId === companyId
        ) ?? null;
    });

    readonly currentRole = computed(() =>
        this.currentCompany()?.role ?? null
    );

    setCurrentCompany(companyId: string): void {
        this._currentCompanyId.set(companyId);
    }

    hasRole(...roles: Role[]): boolean {
        const role = this.currentRole();
        return role !== null && roles.includes(role);
    }

    hasPermission(requiredRole: Role): boolean {
        const role = this.currentRole();

        if (!role) {
            return false;
        }

        return RoleHelper.hasPermission(role, requiredRole);
    }

    login(login: LoginRequestDTO): Observable<AuthUser> {
        return this.http
            .post<void>(
                `${this.apiUrl}/login`,
                login,
                {
                    withCredentials: true
                }
            )
            .pipe(
                switchMap(() => this.me())
            );
    }

    logout(): void {
        this.http.post(
            `${this.apiUrl}/refresh/logout`,
            {},
            { withCredentials: true }
        )
            .subscribe({
                next: () => {
                    this._user.set(null);
                    this._currentCompanyId.set(null);
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.clearAuthState();
                    this.router.navigate(['/']);
                }
            });
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    me(): Observable<AuthUser> {
        return this.http.get<AuthUser>(`${this.apiUrl}/me`,
            {
                withCredentials: true
            }
        )
            .pipe(
                tap(user => {
                    this._user.set(user);
                })
            );
    }

    clearAuthState(): void {
        this._user.set(null);
        this._currentCompanyId.set(null);
    }

    private refreshInProgress$: Observable<void> | null = null;

    refresh(): Observable<void> {
        if (!this.refreshInProgress$) {
            this.refreshInProgress$ = this.http
                .post<void>(
                    `${this.apiUrl}/refresh`,
                    {},
                    {
                        withCredentials: true
                    }
                )
                .pipe(
                    finalize(() => {
                        this.refreshInProgress$ = null;
                    }),
                    shareReplay(1)
                );
        }

        return this.refreshInProgress$;
    }

    isAuthenticated(): boolean {
        return this._user() !== null;
    }

    initialize(): Observable<AuthUser | null> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(null);
        }

        return this.me().pipe(
            tap(),
            catchError(error => {
                return of(null);
            })
        );
    }
}