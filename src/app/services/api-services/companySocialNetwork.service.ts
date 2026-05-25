import { Injectable } from "@angular/core";
import { environment } from "../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SocialNetworkRequestDTO } from "../../models/socialNetwork";
import { CompanySocialNetworkResponseDTO } from "../../models/company.model";
import { dot } from "node:test/reporters";

@Injectable({
    providedIn: 'root'
})
export class CompanySocialNetworkService {
    private apiUrl = `${environment.apiUrl}/api/company`;

    constructor(
        private http: HttpClient,
    ) { }

    addSocialToCompany(companyId: string, data: SocialNetworkRequestDTO): Observable<CompanySocialNetworkResponseDTO> {
        return this.http.post<CompanySocialNetworkResponseDTO>(`${this.apiUrl}/${companyId}/social`, data)
    }

    deleteSocialToCompany(companyId: string, socialId: string): void {
        this.http.delete(`${this.apiUrl}/${companyId}/social/${socialId}`)
    }

    editSocialInCompany(companyId: string, socialId: string, data: SocialNetworkRequestDTO): Observable<CompanySocialNetworkResponseDTO> {
        return this.http.put<CompanySocialNetworkResponseDTO>(`${this.apiUrl}/${companyId}/social/${socialId}`, data)
    }
}