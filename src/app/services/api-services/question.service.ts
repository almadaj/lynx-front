import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Page, QuestionResponseDTO } from "../../models/question.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = `${environment.apiUrl}/api/question`;

    constructor(
        private http: HttpClient,
    ) { }

    findAll(search: string, page: number, size: number) {
        return this.http.get<Page<QuestionResponseDTO>>(
            `${this.apiUrl}`,
            {
                params: {
                    search,
                    page,
                    size,
                    sort: 'createdAt,desc'
                }
            }
        )
    }
}