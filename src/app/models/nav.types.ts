export enum NavStateStatus {
    NO_CONTEXT,
    IN_CONTEXT,
}

export type ProjectMock = {
    name: string;
    id: string;
}

export type NavState =
    | { status: NavStateStatus.NO_CONTEXT }
    | { status: NavStateStatus.IN_CONTEXT, projectId: string };
