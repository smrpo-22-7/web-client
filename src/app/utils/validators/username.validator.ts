import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import {map, Observable, of} from "rxjs";
import { UserService } from "@services";

export function validateUniqueUsername(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return userService.checkUsernameExists(control.value).pipe(
            map((result: boolean) => {
                return result ? { usernameExists: true } : null;
            })
        );
    };
}

export function validateUsernameProfile(userService: UserService): AsyncValidatorFn {
    return (formGroup: AbstractControl): Observable<ValidationErrors | null> => {
        const newUsername = formGroup.get("username")?.value;
        const oldUsername = formGroup.get("oldUsername")?.value;
        if (newUsername === oldUsername) {
            return of(null);
        }
        return userService.checkUsernameExists(newUsername).pipe(
            map((result: boolean) => {
                return result ? { usernameExists: true } : null;
            })
        );
    }
}
