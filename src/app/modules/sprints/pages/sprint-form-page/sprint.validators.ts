import { FormGroup, ValidationErrors } from "@angular/forms";

export function validateDates(formGroup: FormGroup): ValidationErrors | null {
    const startDate: string = formGroup.controls["startDate"].value;

    const endDate: string = formGroup.controls["endDate"].value;
    const errors: ValidationErrors = {};
    let hasErrors = false;

    if (startDate !== null && endDate !== null) {
        if (startDate.length > 0 || endDate.length > 0) {
            if ((new Date(startDate).getTime() > new Date(endDate).getTime())) {
                return {
                    endBeforeStart: true,
                };

            }
        }
    }
    return null;

}

export function valiStartdate(formGroup: FormGroup): ValidationErrors | null {
    const startDate: string = formGroup.controls["startDate"].value;

    if (startDate !== null && startDate.length > 0) {
        if ((new Date(startDate).getTime() < new Date().getTime())) {
            return {
                startInPast: true,
            };
        }
    }
    return null;

}
