import { ValidationErrors } from "@angular/forms";
import { FieldType, FieldValidators, FormValidationResult } from "@lib";

export function validateField(fieldName: string, value: any, validator: FieldType | null): ValidationErrors | null {
    if (validator === null) {
        return null;
    }
    
    const errors: Record<string, boolean> = {};
    let hasErrors = false;
    
    if (typeof value !== validator.type) {
        if (validator.type === "number") {
            if (isNaN(Number(value))) {
                return {
                    invalidType: true,
                }
            } else {
                if (validator.subtype === "integer") {
                    if (!Number.isInteger(parseFloat(value))) {
                        return {
                            invalidSubtype: true,
                        }
                    }
                }
            }
        } else {
            return {
                invalidType: true,
            };
        }
    }
    
    if (validator.required) {
        if (!value && typeof value !== "boolean") {
            errors["required"] = true;
            hasErrors = true;
        } else if (typeof value === "boolean") {
            const strValue = `${value}`;
            if (strValue !== "true" && strValue !== "false") {
                errors["required"] = true;
                hasErrors = true;
            }
        }
    }
    
    if (validator.type === "boolean") {
        const strValue = `${value}`;
        if (strValue !== "true" && strValue !== "false") {
            errors["invalidValue"] = true;
            hasErrors = true;
        }
    }
    
    if (validator.type === "number") {
        if (validator.max) {
            if (value > validator.max) {
                errors["max"] = true;
                hasErrors = true;
            }
        }
        if (validator.min) {
            if (value < validator.min) {
                errors["min"] = true;
                hasErrors = true;
            }
        }
    }
    
    return hasErrors ? errors : null;
}

export function validateForm(form: Record<string, any>, validators: FieldValidators): ValidationErrors | null {
    return Object.keys(form).reduce((acc: FormValidationResult, field: string) => {
        acc[field] = validateField(field, form[field], validators[field] ?? null);
        return acc;
    }, {} as FormValidationResult);
}
