export enum Role {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    HEADTEACHER = 'HEADTEACHER',
    PRINCIPAL = 'PRINCIPAL',
    ADMIN = 'ADMIN'
}

export const ROLE_LABELS: Record<Role, string> = {
    [Role.STUDENT]: 'Aluno',
    [Role.TEACHER]: 'Professor',
    [Role.HEADTEACHER]: 'Coordenador',
    [Role.PRINCIPAL]: 'Diretor',
    [Role.ADMIN]: 'Administrador',
};

export class RoleHelper {
    private static readonly levels: Record<Role, number> = {
        [Role.STUDENT]: 1,
        [Role.TEACHER]: 2,
        [Role.HEADTEACHER]: 3,
        [Role.PRINCIPAL]: 4,
        [Role.ADMIN]: 5,
    };

    static hasPermission(current: Role, required: Role): boolean {
        return this.levels[current] >= this.levels[required];
    }

    static translate(role: Role): string {
        return ROLE_LABELS[role];
    }
}