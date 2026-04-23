import { Language, LanguageLevel } from "./language.model";

export interface CourseClassResponseDTO {
    id: string;
    name: string;
    level: LanguageLevel;
    language: Language;
    maxStudents: number;
    teacherId: string;
    companyId: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    students: StudentSummaryDTO[];
}

export interface StudentSummaryDTO {
    id: string;
    name: string;
    email: string;
    birth: string;
}