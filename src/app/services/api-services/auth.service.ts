import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO } from '../../models/auth.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(login: LoginRequestDTO): Observable<LoginResponseDTO> {
        return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, login);
    }

    logout(): void {
        sessionStorage.removeItem('token');
        this.router.navigate(['/']);
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    refreshToken(): Observable<any> {
        return this.http.post(`${this.apiUrl}/refresh`, {});
    }

    isAuthenticated(): boolean {
        return !!sessionStorage.getItem('token');
    }
}