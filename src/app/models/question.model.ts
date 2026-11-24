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
    header: string | null;
    body: string | null;
    footer: string | null;
    expectedAnswer: string | null;
    language: Language
    alternatives: QuestionAlternativeResponseDTO[]
}

export interface RegisterQuestionDTO {
    companyId: string
    privacy: number
    questionType: QuestionType
    difficulty: Difficulty
    header: string
    body: string
    footer: string
    expectedAnswer: string
    language: Language
}

export interface UpdateQuestion {
    privacy: number
    questionType: QuestionType
    difficulty: Difficulty
    header: string | null
    body: string
    footer: string | null
    expectedAnswer: string | null
    language: Language
    alternatives: RegisterAlternativeDTO[]
}

export interface QuestionAlternativeResponseDTO {
    id: string
    alternativeText: string
    altOrder: number
    correct: boolean
}

export interface ClassifyQuestionRequest {
    statement: string
    expectedAnswer?: string
    alternatives?: string[]
}

export interface ClassifyQuestionResponse {
    difficulty: Difficulty
    confidence: number
    reason: string
    explication: string
}

export interface RegisterAlternativeDTO {
    altOrder: number;
    alternativeText: string;
    isCorrect: boolean;
}

export interface QuestionFormSubmission {
    question: RegisterQuestionDTO
    alternatives: RegisterAlternativeDTO[]
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