import { StorypriorityService } from "@services";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";

export function validateUniqueStoryTitle(projectId: string, storyService: StorypriorityService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return storyService.checkStoryTitleExists(projectId, control.value).pipe(
            map((result: boolean) => {
                return result ? { titleExists: true } : null;
            })
        );
    };
}
