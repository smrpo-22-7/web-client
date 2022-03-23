export interface BaseType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SimpleStatus = "ACTIVE" | "DISABLED";
export const SimpleStatus = {
    ACTIVE: "ACTIVE" as SimpleStatus,
    DISABLED: "DISABLED" as SimpleStatus,
};

export interface RestParams {
    limit?: number;
    offset?: number;
    order?: string;
    filter?: string;
}

type FieldValidationType = {
    field: string;
    type: string;
}

/**
 * Checks if all fields of given object fit required type
 * @param obj object whose fields will be checked
 * @param fields field metadata
 * @return <code>true</code> if all fields are valid, <code>false</code> otherwise.
 */
export function validateFields(obj: object, ...fields: FieldValidationType[]): boolean {
    return fields.every(fieldType => {
        const { field, type } = fieldType;
        return obj.hasOwnProperty(field) && typeof (obj as any)[field] === type;
    });
}
