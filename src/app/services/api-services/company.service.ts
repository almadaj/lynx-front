import { Injectable } from "@angular/core";
import { environment } from "../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";
import { CompanyResponseDTO } from "../../models/company.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(
        private http: HttpClient,
    ) { }

    findById(companyId: string): Observable<CompanyResponseDTO> {
        return this.http.get<CompanyResponseDTO>(`${this.apiUrl}/company/${companyId}`);
    }
}