import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CompanyResponseDTO, NewTeacherDTO, UserCompanyResponse } from "../../models/company.model";
import { Observable } from "rxjs";
import { UserResponseDTO } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/api/company`;

    constructor(
        private http: HttpClient,
    ) { }

    findById(companyId: string): Observable<CompanyResponseDTO> {
        return this.http.get<CompanyResponseDTO>(`${this.apiUrl}/${companyId}`);
    }

    getAllTeachersByCompany(companyId: string): Observable<UserResponseDTO[]> {
        return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${companyId}/teachers`)
    }

    getAllStudentsByCompany(companyId: string): Observable<UserResponseDTO[]> {
        return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${companyId}/students`)
    }

    addNewTeacherToCompany(companyId: string, dto: NewTeacherDTO): Observable<UserCompanyResponse> {
        return this.http.post<UserCompanyResponse>(`${this.apiUrl}/${companyId}/teachers`, dto)
    }

    addNewStudentToCompany(companyId: string, email: string): Observable<UserCompanyResponse> {
        return this.http.post<UserCompanyResponse>(`${this.apiUrl}/${companyId}/students`, email)
    }

    getMemberById(companyId: string, userCompanyId: string): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/${companyId}/member/${userCompanyId}`)
    }
}