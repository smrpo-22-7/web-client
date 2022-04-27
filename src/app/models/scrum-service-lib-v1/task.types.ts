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

export interface TaskWorkSpent extends BaseType {
    workDate: Date;
    amount: number;
    task: TaskWorkSpent.ProjectTask;
    userId: string;
}

export namespace TaskWorkSpent {
    export interface ProjectTask {
        taskId: string;
        taskDescription: string;
        projectId: string;
        projectTitle: string;
    }
}
