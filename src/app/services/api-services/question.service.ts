import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Page, QuestionResponseDTO } from "../../models/question.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = `${environment.apiUrl}/api/question`;

    constructor(
        private http: HttpClient,
    ) { }

    findAll(filters: {
        search: string
        difficulty: string
        questionType: string
        language: string
        privacy: string
        page: number
        size: number
    }) {
        let params = new HttpParams()
            .set('page', filters.page)
            .set('size', filters.size)
            .set('sort', 'createdAt,desc')

        if (filters.search.trim()) {
            params = params.set('search', filters.search.trim())
        }

        if (filters.difficulty) {
            params = params.set('difficulty', filters.difficulty)
        }

        if (filters.questionType) {
            params = params.set('questionType', filters.questionType)
        }

        if (filters.language) {
            params = params.set('language', filters.language)
        }

        if (filters.privacy !== '') {
            params = params.set('privacy', filters.privacy)
        }

        return this.http.get<Page<QuestionResponseDTO>>(
            this.apiUrl,
            { params }
        )
    }
}