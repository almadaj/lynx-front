import { Role } from "../shared/enum/role.enum"
import { UserResponseDTO } from "./user.model"

export interface CompanySocialNetworkResponseDTO {
    id: string
    socialNetworkId: string
    name: string
    icon: string
    url: string
}


export interface CompanyResponseDTO {
    id: string
    publicName: string
    companyName: string
    email: string
    phone: string
    cnpj: string
    address: string
    hasOnlineClass: boolean
    isActive: boolean
    principalTeacher: UserResponseDTO
    socialNetworks: CompanySocialNetworkResponseDTO[]
}

export interface UserCompanyResponse {
    companyId: string;
    companyName: string;
    publicName: string;
    role: Role;
}

export interface NewTeacherDTO {
    email: string;
    role: Role;
}