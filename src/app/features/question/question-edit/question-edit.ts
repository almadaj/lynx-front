
import { Component, inject, signal, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatIconModule } from "@angular/material/icon"
import { QuestionForm } from "../component/question-form/question-form"
import { QuestionService } from "../../../services/api-services/question.service"
import { ToastService } from "../../../shared/toaster/toast.service"
import {
    QuestionFormSubmission,
    QuestionResponseDTO,
    UpdateQuestion
} from "../../../models/question.model"

@Component({
    selector: "app-question-edit",
    standalone: true,
    imports: [QuestionForm, MatIconModule],
    templateUrl: "./question-edit.html",
    styleUrl: "./question-edit.scss"
})
export class QuestionEdit implements OnInit {
    private route = inject(ActivatedRoute)
    private router = inject(Router)
    private questionService = inject(QuestionService)
    private toastService = inject(ToastService)

    question = signal<QuestionResponseDTO | null>(null)
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)

    private questionId = ""

    ngOnInit(): void {
        this.questionId = this.route.snapshot.paramMap.get("id") ?? ""

        console.log('ID recebido pela rota:', this.questionId)

        if (!this.questionId) {
            this.router.navigate(["/question"])
            return
        }

        this.loadQuestion()
    }

    loadQuestion(): void {
        this.loading.set(true)
        this.error.set(null)

        this.questionService.findById(this.questionId).subscribe({
            next: question => {
                this.question.set(question)
                this.loading.set(false)
            },
            error: err => {
                console.error("Erro ao carregar questão:", err)

                this.error.set(
                    "Não foi possível carregar os dados da questão."
                )

                this.loading.set(false)
            }
        })
    }

    onValidationFailed(): void {
        this.toastService.warning(
            "Preencha os campos obrigatórios e verifique as alternativas."
        )
    }

    updateQuestion(data: QuestionFormSubmission): void {
        if (this.saving()) return

        this.saving.set(true)

        const dto: UpdateQuestion = {
            privacy: data.question.privacy,
            questionType: data.question.questionType,
            difficulty: data.question.difficulty,
            header: data.question.header.trim() || null,
            body: data.question.body,
            footer: data.question.footer.trim() || null,
            expectedAnswer: data.question.expectedAnswer.trim() || null,
            language: data.question.language,
            alternatives: data.alternatives
        }

        this.questionService.update(this.questionId, dto).subscribe({
            next: () => {
                this.saving.set(false)

                this.toastService.success(
                    "Questão atualizada com sucesso!"
                )

                this.router.navigate(["/question", this.questionId])
            },
            error: err => {
                console.error("Erro ao atualizar questão:", err)

                this.toastService.error(
                    "Não foi possível atualizar a questão. Tente novamente."
                )

                this.saving.set(false)
            }
        })
    }

    goBack(): void {
        this.router.navigate(["/question", this.questionId])
    }

    cancel(): void {
        this.router.navigate(["/question"])
    }
}
