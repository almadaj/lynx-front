import { Observable } from "rxjs";
import { UserResponseDTO } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(
        private http: HttpClient,
    ) { }

    findById(userId: string): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/user/${userId}`);
    }

    findByEmail(email: string): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/user/email=${email}`);
    }

    findMyInfo(): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/user/me`)
    }

    uploadProfilePhoto(file: File): Observable<void> {
        const formData = new FormData()
        formData.append('file', file)

        return this.http.put<void>(
            `${this.apiUrl}/user/me/photo`,
            formData,
            { withCredentials: true }
        )
    }

    deleteProfilePhoto(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}/photo`);
    }
}