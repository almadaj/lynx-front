import { Role } from "../shared/enum/role.enum";

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    birth: string;
    isActive: boolean;
    isAdmin: boolean;
}

export interface UserResponseDTO {
    userCompanyId: string;
    name: string;
    email: string;
    birth: string;
    companies: UserCompanyResponse[];
    profilePhoto: string;
    isActive: boolean;
    isAdmin: boolean;
}

export interface UserCompanyResponse {
    userCompanyId: string;
    companyId: string;
    companyName: string;
    publicName: string;
    role: Role;
}

export interface UserCompany {
    companyId: string;
    companyName: string;
    publicName: string;
    role: Role;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    companies: UserCompany[];
}