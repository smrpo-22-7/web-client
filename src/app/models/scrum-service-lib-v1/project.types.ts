import { BaseType, SimpleStatus, User, validateFields } from "@lib";

export interface ProjectRole extends BaseType {
    roleId: string;
    name: string;
}

export interface Project extends BaseType {
    name: string;
    status: SimpleStatus;
}

export interface ProjectQuery {
    id: string;
    name: string;
}

export interface SprintConflictCheckRequest {
    startDate: Date;
    endDate: Date;
}

export interface ProjectMember {
    user?: User;
    projectRole?: ProjectRole;
    projectId?: string;
    userId: string;
    projectRoleId: string;
}

export interface NameCheckRequest {
    value: string;
}

export interface ProjectRequest {
    name: string;
    members: ProjectMember[];
}

export interface ProjectRolesCount {
    projectId: string;
    membersCount: number;
    productOwnersCount: number;
    scrumMastersCount: number;
}

export function isProjectRegisterRequest(request: unknown): request is ProjectRequest {
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
