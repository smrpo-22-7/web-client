import { BaseType, UserRegisterRequest, validateFields } from "@lib";



export interface StoryRegisterRequest {
    title: string
    description: string
    priority: string
    businessValue: number
    timeEstimate: number
    tests:  { result: string }[];
}

export function isStoryRegisterRequest(request: unknown): request is StoryRegisterRequest {
    if (request instanceof Object) {
        const obj = request as any;
        if (validateFields(obj,
            { field: "title", type: "string" },
            { field: "description", type: "string" },
            { field: "priority", type: "string" },
            { field: "businessValue", type: "number" },
            { field: "timeEstimate", type: "number" }
            //{ field: "userId", type: "string" },
            //{ field: "projectRoleId", type: "string" },
        )) {
            if (obj.hasOwnProperty("tests") && Array.isArray(obj["tests"])) {
                return true;
            }
        }
    }
    return false;
}