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
    id: string;
    name: string;
    email: string;
    birth: string;
    companies: UserCompanyResponse[];
    profilePhoto: string;
    isActive: boolean;
    isAdmin: boolean;
}

export interface UserCompanyResponse {
    companyId: string;
    companyName: string;
    publicName: string;
    role: Role;
}