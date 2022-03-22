import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";
import { ProjectService } from "@services";

export function validateUniqueProjectName(projectService: ProjectService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return projectService.checkProjectExists(control.value).pipe(
            map((result: boolean) => {
                return result ? { nameExists: true } : null;
            })
        );
    };
}