import { BaseType, SimpleStatus, UserProfile } from "@lib";

export interface TaskAssignment {
    pending: boolean;
    assignee: UserProfile;
    assigneeId: string;
}

export interface Task extends BaseType {
    description: string;
    estimate: number;
    completed: boolean;
    storyId: string;
    status: SimpleStatus;
    assignment: TaskAssignment;
}
