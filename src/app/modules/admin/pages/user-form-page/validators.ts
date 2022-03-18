import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SysRole } from "@lib";

export function validateUserForm(formGroup: FormGroup): ValidationErrors | null {
    const pass1 = formGroup.get("password") as FormControl;
    const pass2 = formGroup.get("confirmPassword") as FormControl;
    
    const errors: ValidationErrors = {};
    let hasErrors = false;
    
    if (pass1.touched || pass2.touched) {
        if (pass1.value !== pass2.value) {
            errors["password"] = true;
            hasErrors = true;
        }
    }
    
    return hasErrors ? errors : null;
}

export function validateUserRoles(formControl: AbstractControl): ValidationErrors | null {
    const roles = formControl as FormArray;
    
    let hasErrors = false;
    const errors: ValidationErrors = {};
    
    if (roles.length === 0) {
        errors["sysRolesRequired"] = true;
        hasErrors = true;
    }
    
    if (roles.length > 0) {
        const assignedRoles = roles.controls.map(ctrl => ctrl.value);
        if (assignedRoles.includes(SysRole.RoleId.ADMIN) && !assignedRoles.includes(SysRole.RoleId.USER)) {
            errors["sysRolesAdmin"] = true;
            hasErrors = true;
        }
    }
    
    return hasErrors ? errors : null;
}
