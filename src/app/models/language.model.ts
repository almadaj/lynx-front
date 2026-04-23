export enum LanguageLevel {
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2',
}

export enum Language {
    ENGLISH = 'ENGLISH',
    SPANISH = 'SPANISH',
    FRENCH = 'FRENCH',
    GERMAN = 'GERMAN',
    ITALIAN = 'ITALIAN',
    PORTUGUESE = 'PORTUGUESE'
}

export const LanguageLevelDescription: Record<LanguageLevel, string> = {
    [LanguageLevel.A1]: 'Iniciante',
    [LanguageLevel.A2]: 'Básico',
    [LanguageLevel.B1]: 'Intermediário',
    [LanguageLevel.B2]: 'Intermediário Avançado',
    [LanguageLevel.C1]: 'Avançado',
    [LanguageLevel.C2]: 'Proficiente',
};

