import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { UserService } from "@services";
import { map, Observable, of, take } from "rxjs";

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
            }),
            take(1),
        );
    }
}
