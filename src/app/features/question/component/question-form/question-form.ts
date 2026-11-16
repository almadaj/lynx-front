
import { Component, EventEmitter, Input, Output, inject, signal } from "@angular/core"
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { RegisterQuestionDTO } from "../../../../models/question.model"
import { Difficulty } from "../../../../shared/enum/difficulty.enum"
import { QuestionType } from "../../../../shared/enum/question-type.enum"
import { Language } from "../../../../models/language.model"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from '@angular/material/tooltip'
import { UserService } from "../../../../services/api-services/user.service"
import { UserCompany } from "../../../../models/user.model"

@Component({
    selector: "app-question-form",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: "./question-form.html",
    styleUrl: "./question-form.scss"
})
export class QuestionForm {
    private fb = inject(FormBuilder)
    private userService = inject(UserService)

    @Input() initialData?: RegisterQuestionDTO
    @Output() submitted = new EventEmitter<RegisterQuestionDTO>()

    readonly difficulties = Object.values(Difficulty)
    readonly questionTypes = Object.values(QuestionType)
    readonly languages = Object.values(Language)
    companies = signal<UserCompany[]>([])
    selectedCompany = signal<UserCompany | null>(null)

    constructor() {
        this.fetchCompanyInfo()
    }

    readonly form = this.fb.group({
        companyId: ["", Validators.required],
        privacy: [0, Validators.required],
        questionType: [QuestionType.MULTIPLE_CHOICE, Validators.required],
        difficulty: [Difficulty.MEDIUM, Validators.required],
        header: [""],
        body: ["", Validators.required],
        footer: [""],
        expectedAnswer: [""],
        language: [Language.PORTUGUESE, Validators.required],
        alternatives: this.fb.array([])
    })

    get alternatives(): FormArray {
        return this.form.get("alternatives") as FormArray
    }

    get isMultipleChoice(): boolean {
        return this.form.get("questionType")?.value === QuestionType.MULTIPLE_CHOICE
    }

    fetchCompanyInfo(): void {
        this.userService.findMyInfo().subscribe({
            next: user => {
                this.companies.set(user.companies)

                const company = user.companies[0] ?? null
                this.selectedCompany.set(company)

                if (company) {
                    this.form.patchValue({
                        companyId: company.companyId
                    })
                }
            }
        })
    }

    onCompanyChange(companyId: string): void {
        const company = this.companies().find(
            company => company.companyId === companyId
        ) ?? null

        this.selectedCompany.set(company)
    }

    addAlternative(): void {
        this.alternatives.push(
            this.fb.group({
                alternativeText: ["", Validators.required],
                correct: [false]
            })
        )
    }

    removeAlternative(index: number): void {
        this.alternatives.removeAt(index)
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const { alternatives, ...questionData } = this.form.getRawValue()

        this.submitted.emit(questionData as RegisterQuestionDTO)
    }
}
