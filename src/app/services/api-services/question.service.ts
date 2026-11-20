import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Page, QuestionAlternativeResponseDTO, QuestionResponseDTO, RegisterAlternativeDTO, RegisterQuestionDTO, UpdateQuestion } from "../../models/question.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = `${environment.apiUrl}/api/question`;

    constructor(
        private http: HttpClient,
    ) { }

    findById(id: string) {
        return this.http.get<QuestionResponseDTO>(
            `${this.apiUrl}/${id}`
        )
    }

    findAlternatives(questionId: string) {
        return this.http.get<QuestionAlternativeResponseDTO[]>(
            `${this.apiUrl}/${questionId}/alternatives`
        )
    }

    create(dto: RegisterQuestionDTO): Observable<QuestionResponseDTO> {
        return this.http.post<QuestionResponseDTO>(
            `${this.apiUrl}`, dto
        )
    }

    update(id: string, dto: UpdateQuestion): Observable<QuestionResponseDTO> {
        return this.http.put<QuestionResponseDTO>(
            `${this.apiUrl}/${id}`,
            dto
        )
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }

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

    addAlternatives(
        questionId: string,
        alternatives: RegisterAlternativeDTO[]
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/${questionId}/alternatives`,
            alternatives
        )
    }
}