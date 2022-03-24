import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { SprintService } from "@services";
import { map, Observable } from "rxjs";
import { SprintConflictCheckRequest } from "@lib";
import { truncateTime } from "@utils";

export function validateDates(formGroup: FormGroup): ValidationErrors | null {
    const startDate: string = formGroup.controls["startDate"].value;
    
    const endDate: string = formGroup.controls["endDate"].value;
    
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

export function validateSprintDates(projectId: string, sprintService: SprintService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const request: SprintConflictCheckRequest = {
            startDate: truncateTime(new Date(control.get("startDate")!.value)),
            endDate: truncateTime(new Date(control.get("endDate")!.value)),
        };
        return sprintService.checkForConflicts(projectId, request).pipe(
            map((result: boolean) => {
                return result ? { sprintConflict: true } : null;
            })
        );
    };
}
