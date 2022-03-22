import { BaseType } from "@lib";

export interface SysRole extends BaseType {
    roleId: SysRole.RoleId;
    name: string;
}

export namespace SysRole {
    export type RoleId = "admin" | "user";
    export const RoleId = {
        ADMIN: "admin" as RoleId,
        USER: "user" as RoleId,
    };
}
