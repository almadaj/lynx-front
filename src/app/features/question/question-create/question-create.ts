import { Component, inject, signal } from "@angular/core"
import { Router } from "@angular/router"
import { QuestionFormSubmission, RegisterQuestionDTO } from "../../../models/question.model"
import { QuestionForm } from "../component/question-form/question-form"
import { MatIconModule } from "@angular/material/icon"
import { QuestionService } from "../../../services/api-services/question.service"
import { ToastService } from "../../../shared/toaster/toast.service"
import { catchError, map, of, switchMap } from "rxjs"

@Component({
    selector: "app-question-create",
    standalone: true,
    imports: [QuestionForm, MatIconModule],
    templateUrl: "./question-create.html",
    styleUrl: "./question-create.scss"
})
export class QuestionCreate {
    private router = inject(Router)
    private questionService = inject(QuestionService)
    private toastService = inject(ToastService)

    loading = signal(false)
    error = signal<string | null>(null)


    onValidationFailed(): void {
        this.toastService.warning(
            "Preencha os campos obrigatórios e verifique as alternativas."
        )
    }

    createQuestion(data: QuestionFormSubmission): void {
        if (this.loading()) return

        this.loading.set(true)
        this.error.set(null)

        this.questionService.create(data.question).pipe(
            switchMap(question => {
                if (data.alternatives.length === 0) {
                    return of({
                        question,
                        alternativesSaved: true
                    })
                }

                return this.questionService.addAlternatives(
                    question.id,
                    data.alternatives
                ).pipe(
                    map(() => ({
                        question,
                        alternativesSaved: true
                    })),
                    catchError(error => of({
                        question,
                        alternativesSaved: false,
                        error
                    }))
                )
            })
        ).subscribe({
            next: result => {
                this.loading.set(false)

                if (result.alternativesSaved) {
                    this.toastService.success("Questão criada com sucesso!")
                } else {
                    console.error(
                        "Questão criada, mas houve erro ao salvar alternativas:",
                        result
                    )

                    this.toastService.error(
                        "A questão foi criada, mas não foi possível salvar as alternativas."
                    )
                }

                this.router.navigate(["/question", result.question.id])
            },
            error: err => {
                console.error("Erro ao criar questão:", err)

                this.toastService.error(
                    "Não foi possível criar a questão. Tente novamente."
                )

                this.loading.set(false)
            }
        })
    }

    cancel(): void {
        this.router.navigate(["/question"])
    }
}