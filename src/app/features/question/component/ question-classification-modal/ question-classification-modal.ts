import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ClassifyQuestionResponse } from '../../../../models/question.model'
import { MatIconModule } from '@angular/material/icon'


@Component({
    selector: 'app-question-classification-modal',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './question-classification-modal.html',
    styleUrl: './question-classification-modal.scss'
})
export class QuestionClassificationModal {
    @Input({ required: true }) result!: ClassifyQuestionResponse
    @Output() closed = new EventEmitter<void>()

    readonly difficultyLabels: Record<string, string> = {
        VERY_EASY: 'Muito fácil',
        EASY: 'Fácil',
        MEDIUM: 'Média',
        HARD: 'Difícil',
        VERY_HARD: 'Muito difícil'
    }

    close(): void {
        this.closed.emit()
    }
}