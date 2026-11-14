import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { MatIconModule } from '@angular/material/icon'

import { QuestionService } from '../../../services/api-services/question.service'
import { QuestionResponseDTO } from '../../../models/question.model'
import { QuestionAlternativeResponseDTO } from '../../../models/question.model'
import { QuestionType } from '../../../shared/enum/question-type.enum'

@Component({
    selector: 'app-question-details',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './question-details.html',
    styleUrl: './question-details.scss'
})
export class QuestionDetails implements OnInit {
    private route = inject(ActivatedRoute)
    private router = inject(Router)
    private questionService = inject(QuestionService)
    private destroyRef = inject(DestroyRef)

    question = signal<QuestionResponseDTO | null>(null)
    alternatives = signal<QuestionAlternativeResponseDTO[]>([])

    loading = signal(true)
    error = signal<string | null>(null)

    questionType = QuestionType

    ngOnInit() {
        this.route.paramMap.pipe(
            tap(() => {
                this.loading.set(true)
                this.error.set(null)
                this.question.set(null)
                this.alternatives.set([])
            }),
            switchMap(params => {
                const id = params.get('id')

                if (!id) {
                    return of({
                        question: null,
                        alternatives: [],
                        error: 'Identificador da questão não informado.'
                    })
                }

                return this.questionService.findById(id).pipe(
                    switchMap(question => {
                        if (question.questionType !== QuestionType.MULTIPLE_CHOICE) {
                            return of({
                                question,
                                alternatives: [],
                                error: null
                            })
                        }

                        return this.questionService.findAlternatives(id).pipe(
                            map(alternatives => ({
                                question,
                                alternatives,
                                error: null
                            }))
                        )
                    }),
                    catchError(() => of({
                        question: null,
                        alternatives: [],
                        error: 'Não foi possível carregar a questão.'
                    }))
                )
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.question.set(result.question)
            this.alternatives.set(result.alternatives)
            this.error.set(result.error)
            this.loading.set(false)
        })
    }

    goBack() {
        this.router.navigate(['/question'])
    }

    getDifficultyLabel(difficulty: string): string {
        const labels: Record<string, string> = {
            VERY_EASY: 'Muito fácil',
            EASY: 'Fácil',
            MEDIUM: 'Médio',
            HARD: 'Difícil',
            VERY_HARD: 'Muito difícil'
        }

        return labels[difficulty] ?? difficulty
    }

    getLanguageLabel(language: string): string {
        const labels: Record<string, string> = {
            ENGLISH: 'Inglês',
            SPANISH: 'Espanhol',
            FRENCH: 'Francês',
            GERMAN: 'Alemão',
            ITALIAN: 'Italiano',
            PORTUGUESE: 'Português',
            DUTCH: 'Holandês',
            ARABIC: 'Árabe'
        }

        return labels[language] ?? language
    }
}