import { BaseType, UserRegisterRequest } from "@lib";
import { validateFields } from "./common.types";

export interface SprintRegisterRequest {
    title: string;
    startDate: string;
    endDate: string;
    expectedSpeed: number;
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