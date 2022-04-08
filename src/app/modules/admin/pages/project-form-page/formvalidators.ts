import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SysRole } from "@lib";
import { ProjectRole } from "@config/roles.config";

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

export function validateUsersAndRoles(formGroup: FormGroup): ValidationErrors | null {
    const usersArray = formGroup.get("members") as FormArray;
    
    const errors: ValidationErrors = {};
    let hasErrors = false;
    
    if (usersArray.length === 0) {
        hasErrors = true;
        errors["noMembers"] = true;
    }
    
    const hasRequiredRoles =
        usersArray.controls.filter(ctrl => ctrl.value === ProjectRole.SCRUM_MASTER).length === 1 &&
        usersArray.controls.filter(ctrl => ctrl.value === ProjectRole.PRODUCT_OWNER).length === 1 &&
        usersArray.controls.filter(ctrl => ctrl.value === ProjectRole.MEMBER).length >= 1;
    if (!hasRequiredRoles) {
        hasErrors = true;
        errors["missingRoles"] = true;
    }
    
    return hasErrors ? errors : null;
}
