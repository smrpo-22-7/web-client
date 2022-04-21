import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validateInt(formControl: AbstractControl): ValidationErrors | null {
    if (formControl.value === undefined) {
        return null;
    }
    const numberCheck = validateNumber(formControl);
    if (numberCheck === null) {
        if (!Number.isInteger(parseFloat(formControl.value))) {
            return {
                notInt: true,
            }
        }
    }
    return numberCheck;
}

export function validateFloat(formControl: AbstractControl): ValidationErrors | null {
    if (formControl.value === undefined) {
        return null;
    }
    const numberCheck = validateNumber(formControl);
    if (numberCheck === null) {
        const numValue = parseFloat(formControl.value);
        if (numValue % 1 === 0) {
            return {
                notFloat: true,
            }
        }
    }
    return numberCheck;
}

export function validateNumber(formControl: AbstractControl): ValidationErrors | null {
    if (formControl.value === undefined) {
        return null;
    }
    if (isNaN(Number(formControl.value))) {
        return {
            notNumber: true,
        };
    }
    return null;
}
