import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { QuestionService } from '../../services/api-services/question.service'
import { Component, inject, signal } from '@angular/core'
import { QuestionResponseDTO } from '../../models/question.model'

@Component({
    selector: 'app-question',
    standalone: true,
    imports: [FormsModule, MatIconModule],
    templateUrl: './question.html',
    styleUrl: './question.scss'
})
export class Question {
    private questionService = inject(QuestionService)
    private router = inject(Router)

    questions = signal<QuestionResponseDTO[]>([])
    loading = signal(false)
    error = signal<string | null>(null)

    search = signal('')
    selectedDifficulty = signal('')
    selectedQuestionType = signal('')
    selectedLanguage = signal('')
    selectedPrivacy = signal('')

    page = signal(0)
    size = signal(10)
    totalPages = signal(0)
    totalElements = signal(0)

    difficulties = [
        { value: 'VERY_EASY', label: 'Muito fácil' },
        { value: 'EASY', label: 'Fácil' },
        { value: 'MEDIUM', label: 'Médio' },
        { value: 'HARD', label: 'Difícil' },
        { value: 'VERY_HARD', label: 'Muito difícil' }
    ]

    questionTypes = [
        { value: 'MULTIPLE_CHOICE', label: 'Múltipla escolha' },
        { value: 'ESSAY_QUESTION', label: 'Discursiva' }
    ]

    languages = [
        { value: 'ENGLISH', label: 'Inglês' },
        { value: 'SPANISH', label: 'Espanhol' },
        { value: 'FRENCH', label: 'Francês' },
        { value: 'GERMAN', label: 'Alemão' },
        { value: 'ITALIAN', label: 'Italiano' },
        { value: 'PORTUGUESE', label: 'Português' },
        { value: 'DUTCH', label: 'Holandês' },
        { value: 'ARABIC', label: 'Árabe' }
    ]

    privacies = [
        { value: '0', label: 'Públicas' },
        { value: '1', label: 'Institucionais' },
        { value: '2', label: 'Privadas por mim' }
    ]

    constructor() {
        this.fetchQuestions()
    }

    fetchQuestions(): void {
        this.loading.set(true)
        this.error.set(null)

        this.questionService.findAll(
            this.search(),
            this.page(),
            this.size()
        ).subscribe({
            next: response => {
                this.questions.set(response.content)
                this.totalPages.set(response.totalPages)
                this.totalElements.set(response.totalElements)
                this.loading.set(false)
            },
            error: err => {
                console.error('Erro ao buscar questões:', err)
                this.error.set('Não foi possível carregar as questões.')
                this.loading.set(false)
            }
        })
    }

    searchQuestions(): void {
        this.page.set(0)
        this.fetchQuestions()
    }

    clearFilters(): void {
        this.search.set('')
        this.selectedDifficulty.set('')
        this.selectedQuestionType.set('')
        this.selectedLanguage.set('')
        this.selectedPrivacy.set('')
        this.page.set(0)
        this.fetchQuestions()
    }

    nextPage(): void {
        if (this.page() < this.totalPages() - 1) {
            this.page.update(value => value + 1)
            this.fetchQuestions()
        }
    }

    previousPage(): void {
        if (this.page() > 0) {
            this.page.update(value => value - 1)
            this.fetchQuestions()
        }
    }

    createQuestion(): void {
        this.router.navigate(['/questions/new'])
    }

    getDifficultyLabel(value: string): string {
        return this.difficulties.find(item => item.value === value)?.label ?? value
    }

    getQuestionTypeLabel(value: string): string {
        return this.questionTypes.find(item => item.value === value)?.label ?? value
    }

    getLanguageLabel(value: string): string {
        return this.languages.find(item => item.value === value)?.label ?? value
    }

    getPrivacyLabel(value: number): string {
        return this.privacies.find(item => Number(item.value) === value)?.label ?? 'Não informado'
    }

    viewQuestion(id: string): void {
        // Implementaremos a visualização posteriormente.
    }

    editQuestion(id: string): void {
        // Implementaremos a edição posteriormente.
    }

    deleteQuestion(id: string): void {
        // Implementaremos a exclusão posteriormente.
    }
}