export interface CheckboxSelectEvent<T> {
    checked: boolean;
    item: T;
}

export interface FieldUpdateEvent<T> {
    field: string;
    item: T;
    requestRefresh?: boolean;
}

export interface FormUpdateEvent {
    [field: string]: any;
    requestRefresh?: boolean;
}
