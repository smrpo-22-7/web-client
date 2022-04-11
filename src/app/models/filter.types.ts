export type StoriesFilter = "ALL" | "REALIZED" | "NOT_REALIZED" | "ESTIMATED" | "NOT_ESTIMATED";

export interface KeeQuery {
    offset?: number;
    limit?: number;
    order?: string;
    filter?: string;
}

export type WrapOption = "wrap" | "nowrap";
