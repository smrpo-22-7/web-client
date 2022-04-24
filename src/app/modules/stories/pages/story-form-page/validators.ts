import { StoryService } from "@services";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import {map, Observable, of} from "rxjs";

export function validateUniqueStoryTitleOne(projectId: string, storyService: StoryService): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const newTitle = control.get("title")?.value;
        const oldTitle = control.get("oldtitle")?.value;
        if (newTitle === oldTitle) {
            return of(null);
        }
        return storyService.checkStoryTitleExists(projectId, control.value).pipe(
            map((result: boolean) => {
                return result ? { titleExists: true } : null;
            })
        );
    };
}

export function validateUniqueStoryTitle(projectId: string, storyService: StoryService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return storyService.checkStoryTitleExists(projectId, control.value).pipe(
            map((result: boolean) => {
                return result ? { titleExists: true } : null;
            })
        );
    };
}
