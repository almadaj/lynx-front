import { Component, inject, signal } from "@angular/core"
import { Router } from "@angular/router"
import { RegisterQuestionDTO } from "../../../models/question.model"
import { QuestionForm } from "../component/question-form/question-form"
import { MatIconModule } from "@angular/material/icon"
import { QuestionService } from "../../../services/api-services/question.service"
import { ToastService } from "../../../shared/toaster/toast.service"

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

    createQuestion(data: RegisterQuestionDTO): void {
        if (this.loading()) return

        this.loading.set(true)
        this.error.set(null)

        this.questionService.create(data).subscribe({
            next: question => {
                this.loading.set(false)
                this.toastService.success("Questão criada com sucesso!")
                this.router.navigate(["/question", question.id])
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