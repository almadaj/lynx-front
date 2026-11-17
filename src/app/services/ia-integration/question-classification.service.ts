import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { ClassifyQuestionRequest, ClassifyQuestionResponse } from "../../models/question.model"
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class QuestionClassificationService {
    private apiUrl = `${environment.apiUrl}/api/question`;

    constructor(
        private http: HttpClient,
    ) { }

    classify(data: ClassifyQuestionRequest) {
        return this.http.post<ClassifyQuestionResponse>(
            `${this.apiUrl}/classify`,
            data
        )
    }
}