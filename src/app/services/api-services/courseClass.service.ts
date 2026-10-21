import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CourseClassResponseDTO, NewCourseClassDTO } from "../../models/courseClass.model";

@Injectable({
    providedIn: 'root'
})
export class CourseClassService {
    private apiUrl = `${environment.apiUrl}/api/course`;

    constructor(
        private http: HttpClient,
    ) { }

    getMyCourseClasses(): Observable<CourseClassResponseDTO[]> {
        return this.http.get<CourseClassResponseDTO[]>(`${this.apiUrl}/my`)
    }

    getAllCourses(): Observable<CourseClassResponseDTO> {
        return this.http.get<CourseClassResponseDTO>(`${this.apiUrl}/all`)
    }

    create(dto: NewCourseClassDTO): Observable<CourseClassResponseDTO> {
        return this.http.post<CourseClassResponseDTO>(`${this.apiUrl}`, dto)
    }
}