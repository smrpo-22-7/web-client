export interface BaseType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RestParams {
    limit?: number;
    offset?: number;
    order?: string;
    filter?: string;
}
