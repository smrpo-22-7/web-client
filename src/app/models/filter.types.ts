export type StoriesFilter = "ALL" | "REALIZED" | "NOT_REALIZED" | "ESTIMATED" | "NOT_ESTIMATED";

export interface KeeQuery {
    offset?: number;
    limit?: number;
    order?: string;
    filter?: string;
}

export type WrapOption = "wrap" | "nowrap";

export type SortOrder = "ASC" | "DESC";
export const SortOrder = {
    ASC: "ASC" as SortOrder,
    DESC: "DESC" as SortOrder,
};

export type BoolOptFilter = "true" | "false" | null;

export type ProjectStoriesParams = {
    numberIdSort?: SortOrder;
    filterRealized?: BoolOptFilter;
    filterAssigned?: BoolOptFilter;
    limit?: number;
    offset?: number;
}

