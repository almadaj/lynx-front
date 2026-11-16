
import { Component, inject, signal } from "@angular/core"
import { Router } from "@angular/router"
import { RegisterQuestionDTO } from "../../../models/question.model"
import { QuestionForm } from "../component/question-form/question-form"
import { MatIconModule } from "@angular/material/icon"


@Component({
    selector: "app-question-create",
    standalone: true,
    imports: [QuestionForm, MatIconModule],
    templateUrl: "./question-create.html",
    styleUrl: "./question-create.scss"
})
export class QuestionCreate {
    private router = inject(Router)

    loading = signal(false)
    error = signal<string | null>(null)

    createQuestion(data: RegisterQuestionDTO): void {
        // Aqui conectaremos ao QuestionService.
    }

    cancel(): void {
        this.router.navigate(["/question"])
    }
}
