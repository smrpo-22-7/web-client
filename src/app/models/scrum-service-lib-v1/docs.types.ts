import { BaseType } from "@lib";

export interface ProjectDocumentation extends BaseType {
    markdownContent?: string;
    textContent?: string;
    htmlContent?: string;
    projectId: string;
}
