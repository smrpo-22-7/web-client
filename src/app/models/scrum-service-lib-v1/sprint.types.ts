import { BaseType, SimpleStatus, UserRegisterRequest } from "@lib";
import { validateFields } from "./common.types";

export interface SprintRegisterRequest {
    title: string;
    startDate: Date;
    endDate: Date;
    expectedSpeed: number;
}

export interface Sprint extends BaseType {
    title: string;
    startDate: Date;
    endDate: Date;
    status: SimpleStatus;
    expectedSpeed: number;
    projectId: string;
}

export interface SprintListResponse {
    activeSprint: Sprint;
    pastSprints: Sprint[];
    futureSprints: Sprint[];
}

export function isSprintRegisterRequest(request: unknown): request is SprintRegisterRequest {
    if (request instanceof Object) {
        const obj = request as any;
        if (validateFields(obj,
            { field: "title", type: "string" },
            { field: "startDate", type: "string" },
            { field: "endDate", type: "string" },
            { field: "expectedSpeed", type: "number" },
        )) {
            return true;
        }
    }
    return false;
}
