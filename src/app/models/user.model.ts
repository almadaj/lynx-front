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
    isActive: boolean;
    isAdmin: boolean;
}