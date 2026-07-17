import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SocialNetworkResponseDTO } from "../../models/socialNetwork";

@Injectable({
    providedIn: 'root'
})
export class SocialNetworkService {
    private apiUrl = `${environment.apiUrl}/api/social-network`;

    constructor(
        private http: HttpClient,
    ) { }

    listAll(): Observable<SocialNetworkResponseDTO[]> {
        return this.http.get<SocialNetworkResponseDTO[]>(`${this.apiUrl}`)
    }
}