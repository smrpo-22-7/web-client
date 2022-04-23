import { BaseType, SimpleStatus } from "@lib";
import { validateFields } from "./common.types";

export interface User extends BaseType {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    status: SimpleStatus;
}

export interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    grantedRoles: string[];
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

export interface UserPreference {
    userId?: string;
    key: string;
    value: string;
    dataType?: string;
}

export namespace UserPreference {
    export type UserPreferenceKey = "auth.2fa.enabled" | string;
    export const UserPreferenceKey = {
        ENABLED_2FA: "auth.2fa.enabled" as UserPreferenceKey,
    };
}

export function isUserRegisterRequest(request: unknown): request is UserRegisterRequest {
    if (request instanceof Object) {
        const obj = request as any;
        if (validateFields(obj,
            { field: "username", type: "string" },
            { field: "password", type: "string" },
            { field: "firstName", type: "string" },
            { field: "lastName", type: "string" },
            { field: "email", type: "string" },
        )) {
            if (obj.hasOwnProperty("grantedRoles") && Array.isArray(obj["grantedRoles"])) {
                return true;
            }
        }
    }
    return false;
}

export function isUserProfile(profile: unknown): profile is UserProfile {
    if (profile instanceof Object) {
        const obj = profile as any;
        if (validateFields(obj,
            { field: "username", type: "string" },
            { field: "firstName", type: "string" },
            { field: "lastName", type: "string" },
            { field: "email", type: "string" },
        )) {
            return true;
        }
    }
    return false;
}
