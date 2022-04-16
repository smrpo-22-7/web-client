import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidationErrors } from "@angular/forms";
import { map, Observable, of, take, tap } from "rxjs";
import { ProjectService } from "@services";
import { ProjectRole } from "@config/roles.config";

export function validateUniqueProjectName(projectService: ProjectService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return projectService.checkProjectExists(control.value).pipe(
            map((result: boolean) => {
                return result ? { nameExists: true } : null;
            })
        );
    };
}

export function validateProject(projectService: ProjectService): AsyncValidatorFn {
    return (formGroup: AbstractControl): Observable<ValidationErrors | null> => {
        const name = formGroup.get("name")?.value;
        const oldName = formGroup.get("oldName")?.value;
        if (name === oldName) {
            return of(null);
        }
        return projectService.checkProjectExists(name).pipe(
            map((result: boolean) => {
                return result ? { nameExists: true } : null;
            }),
            take(1),
        );
    };
}

export function validateUsersAndRoles(formGroup: FormGroup): ValidationErrors | null {
    const usersArray = formGroup.get("members") as FormArray;
    
    const errors: ValidationErrors = {};
    let hasErrors = false;
    
    if (usersArray.length === 0) {
        hasErrors = true;
        errors["noMembers"] = true;
    }
    
    const hasRequiredRoles =
        usersArray.controls.filter(ctrl => ctrl.get("projectRoleId")?.value === ProjectRole.SCRUM_MASTER).length === 1 &&
        usersArray.controls.filter(ctrl => ctrl.get("projectRoleId")?.value === ProjectRole.PRODUCT_OWNER).length === 1 &&
        usersArray.controls.filter(ctrl => ctrl.get("projectRoleId")?.value === ProjectRole.MEMBER).length >= 1;
    if (!hasRequiredRoles) {
        hasErrors = true;
        errors["missingRoles"] = true;
    }
    
    return hasErrors ? errors : null;
}
