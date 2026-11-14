import { Difficulty } from "../shared/enum/difficulty.enum";
import { QuestionType } from "../shared/enum/question-type.enum";
import { Language } from "./language.model";

export interface QuestionResponseDTO {
    id: string;
    authorId: string;
    companyId: string;
    privacy: number;
    difficulty: Difficulty;
    questionType: QuestionType;
    header: string;
    body: string;
    footer: string;
    expectedAnswer: string;
    language: Language
}

export interface QuestionAlternativeResponseDTO {
    id: string
    alternativeText: string
    altOrder: number
    correct: boolean
}

export interface Page<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    last: boolean
    empty: boolean
}