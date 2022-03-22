import { BaseType, UserRegisterRequest, validateFields } from "@lib";

export interface ProjectRole extends BaseType {
    roleId: string;
    name: string;
}


export interface NameCheckRequest {
    value: string;
}

export interface ProjectRegisterRequest {
    name: string;
    members:  { userId: string, projectRoleId: string }[];
}

export function isProjectRegisterRequest(request: unknown): request is ProjectRegisterRequest {
    if (request instanceof Object) {
        const obj = request as any;
        if (validateFields(obj,
            { field: "name", type: "string" },
            //{ field: "userId", type: "string" },
            //{ field: "projectRoleId", type: "string" },
        )) {
            if (obj.hasOwnProperty("members") && Array.isArray(obj["members"])) {
                return true;
            }
        }
    }
    return false;
}