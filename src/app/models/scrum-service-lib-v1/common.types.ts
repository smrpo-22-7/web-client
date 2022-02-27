export interface BaseType {
    id: string;
    timestamp: Date;
}

export interface RestParams {
    limit?: number;
    offset?: number;
    order?: string;
    filter?: string;
}
