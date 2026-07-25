export enum Role {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    HEADTEACHER = 'HEADTEACHER',
    PRINCIPAL = 'PRINCIPAL',
    ADMIN = 'ADMIN'
}

const ROLE_LEVEL: Record<Role, number> = {
    [Role.STUDENT]: 1,
    [Role.TEACHER]: 2,
    [Role.HEADTEACHER]: 3,
    [Role.PRINCIPAL]: 4,
    [Role.ADMIN]: 5,
};

export class RoleUtil {
    static hasPermission(current: Role, required: Role): boolean {
        return ROLE_LEVEL[current] >= ROLE_LEVEL[required];
    }
}