export type StoriesFilter = "ALL" | "REALIZED" | "NOT_REALIZED" | "ESTIMATED" | "NOT_ESTIMATED";

export interface KeeQuery {
    offset?: number;
    limit?: number;
    order?: string;
    filter?: string;
}

export type WrapOption = "wrap" | "nowrap";

export type ProjectStoriesParams = {
    numberIdSort?: "ASC" | "DESC";
    filterRealized?: boolean;
    filterAssigned?: boolean;
    limit?: number;
    offset?: number;
}
