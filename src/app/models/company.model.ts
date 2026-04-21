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
    principalTeacherId: string
    socialNetworks: CompanySocialNetworkResponseDTO[]
}