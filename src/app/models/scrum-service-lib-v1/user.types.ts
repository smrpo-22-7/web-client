import { BaseType } from "@lib";

export interface User extends BaseType {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
}
