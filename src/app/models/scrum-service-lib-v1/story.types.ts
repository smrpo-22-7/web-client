import { BaseType, SimpleStatus, validateFields } from "@lib";

export interface AcceptanceTest extends BaseType {
    result: string;
    storyId: string;
}

export interface Story extends BaseType {
    title: string;
    description: string;
    numberId: number;
    status: SimpleStatus;
    businessValue: number;
    timeEstimate: number;
    priority: Story.Priority;
    tests: AcceptanceTest[];
}

export namespace Story {
    export type Priority = "MUST_HAVE" | "SHOULD_HAVE" | "COULD_HAVE" | "WONT_HAVE_THIS_TIME";
    export const Priority = {
        MUST_HAVE: "MUST_HAVE",
        SHOULD_HAVE: "SHOULD_HAVE",
        COULD_HAVE: "COULD_HAVE",
        WONT_HAVE_THIS_TIME: "WONT_HAVE_THIS_TIME",
    };
}


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
