import { Observable } from "rxjs";
import { UserDTO, UserResponseDTO } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroment/enviroment";
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

    findMyInfo(): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/user/me`)
    }
}