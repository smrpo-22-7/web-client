import { BaseType, SimpleStatus, UserProfile } from "@lib";

export interface ProjectWallPost extends BaseType {
    textContent?: string;
    markdownContent?: string;
    htmlContent?: string;
    status: SimpleStatus;
    author: UserProfile;
    authorId: string;
    projectId: string;
    numOfComments: number;
}

export interface ProjectWallComment extends BaseType {
    textContent?: string;
    markdownContent?: string;
    htmlContent?: string;
    status: SimpleStatus;
    author: UserProfile;
    authorId: string;
    postId: string;
}
