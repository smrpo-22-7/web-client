import { BaseType } from "@lib";

export interface User extends BaseType {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
}

export interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface ChangePasswordRequest {
    password: string;
    newPassword: string;
}

export interface UsernameCheckRequest {
    username: string;
}

export interface UserRegisterRequest {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    grantedRoles: string[];
}
