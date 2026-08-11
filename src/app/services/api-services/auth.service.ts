import { computed, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO } from '../../models/auth.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthUser } from '../../models/user.model';
import { Role } from '../../shared/enum/role.enum';
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

    login(login: LoginRequestDTO): Observable<AuthUser> {
        return this.http
            .post<LoginResponseDTO>(
                `${this.apiUrl}/login`,
                login
            ).pipe(
                tap(response => {
                    sessionStorage.setItem(
                        'token',
                        response.token
                    );
                }),
                switchMap(() => this.me())
            );
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('token');
        }

        this._user.set(null);
        this._currentCompanyId.set(null);

        this.router.navigate(['/']);
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    me(): Observable<AuthUser> {
        return this.http
            .get<AuthUser>(`${this.apiUrl}/me`)
            .pipe(
                tap(user => {
                    this._user.set(user);

                    if (
                        !this._currentCompanyId() &&
                        user.companies.length > 0
                    ) {
                        this._currentCompanyId.set(
                            user.companies[0].companyId
                        );
                    }
                })
            );
    }

    refreshToken(): Observable<any> {
        return this.http.post(`${this.apiUrl}/refresh`, {});
    }

    isAuthenticated(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }
        const token = sessionStorage.getItem('token');
        console.log('Token encontrado:', !!token);
        return !!token;
    }

    initialize(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.isAuthenticated()) {
            return;
        }

        this.me().subscribe({
            error: error => {
                console.error('Erro ao carregar autenticação:', error);
            }
        });
    }
}