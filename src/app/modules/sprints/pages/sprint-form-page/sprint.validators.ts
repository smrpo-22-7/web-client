import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { ProjectService, SprintService } from "@services";
import { map, Observable, switchMap, take } from "rxjs";
import { ProjectRolesCount, SprintConflictCheckRequest } from "@lib";
import { truncateTime } from "@utils";

export function validateDatesOverlap(formGroup: FormGroup): ValidationErrors | null {
    const startDate = formGroup.controls["startDate"].value as Date;
    const endDate = formGroup.controls["endDate"].value as Date;
    
    if (startDate && endDate) {
        if (startDate.getTime() > endDate.getTime()) {
            return {
                endBeforeStart: true,
            };
        }
    }
    return null;
}

export function validateNotBeforeToday(formControl: AbstractControl): ValidationErrors | null {
    const startDate = formControl.value as Date;
    const now = truncateTime(new Date());
    if (startDate) {
        if (startDate.getTime() < now.getTime()) {
            return {
                startInPast: true,
            };
        }
    }
    return null;
}

export function validateSprintDateConflicts(projectId$: Observable<string>, sprintService: SprintService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const request: SprintConflictCheckRequest = {
            startDate: truncateTime(control.get("startDate")?.value),
            endDate: truncateTime(control.get("endDate")?.value),
        };
        return projectId$.pipe(
            switchMap((projectId: string) => {
                return sprintService.checkForConflicts(projectId, request).pipe(
                    map((result: boolean) => {
                        return result ? { sprintConflict: true } : null;
                    })
                );
            }),
            take(1),
        );
    };
}

export function irregularVelocityWarning(projectId$: Observable<string>, projectService: ProjectService): (formGroup: FormGroup) => Observable<boolean> {
    return function (formGroup: FormGroup) {
        const velocity = formGroup.get("expectedSpeed")?.value as number;
        const startDate = formGroup.get("startDate")?.value as Date;
        const endDate = formGroup.get("endDate")?.value as Date;
        
        return projectId$.pipe(
            switchMap((projectId: string) => {
                return projectService.getProjectRolesCount(projectId);
            }),
            map((counts: ProjectRolesCount) => {
                const projectMembers = counts.membersCount + counts.scrumMastersCount;
                const diffInMs = endDate.getTime() - startDate.getTime();
                // round instead of truncate - i.e. 20h is close enough to 1 day
                const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                
                const ptPerDay = velocity / diffInDays;
                
                // multiply by 1.5 to accommodate faster pace
                return ptPerDay > projectMembers * 1.5;
            }),
        );
    }
}
