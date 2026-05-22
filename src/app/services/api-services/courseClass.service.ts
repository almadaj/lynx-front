import { Injectable } from "@angular/core";
import { environment } from "../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CourseClassResponseDTO } from "../../models/courseClass.model";

@Injectable({
    providedIn: 'root'
})
export class CourseClassService {
    private apiUrl = `${environment.apiUrl}/api/course`;

    constructor(
        private http: HttpClient,
    ) { }

    getMyCourseClasses(): Observable<CourseClassResponseDTO[]> {
        return this.http.get<CourseClassResponseDTO[]>(`${this.apiUrl}/me`)
    }

    getAllCourses(): Observable<CourseClassResponseDTO> {
        return this.http.get<CourseClassResponseDTO>(`${this.apiUrl}/all`)
    }
}