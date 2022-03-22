import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SysRole } from "@lib";

/*+import { FormGroup, ValidationErrors } from "@angular/forms";

export function doubleUsers(formGroup: FormGroup): ValidationErrors | null {
    const membersi: string = formGroup.controls["members"].value;

    if (startDate !== null && endDate !== null) {
        if (startDate.length > 0 || endDate.length > 0) {
            if ((new Date(startDate).getTime() > new Date(endDate).getTime())) {
                console.log("wtf");
                return {
                    datesNotGood: true,
                };
            }
        }
    }
    return null;
}**/