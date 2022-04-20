import { ValidationErrors } from "@angular/forms";

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

export interface FieldType {
    type: "string" | "number" | "boolean" | "object";
    min?: number;
    max?: number;
    required?: boolean;
}

export type FormValidationResult = Record<string, ValidationErrors | null>;

export type FieldValidators = Record<string, FieldType>;
