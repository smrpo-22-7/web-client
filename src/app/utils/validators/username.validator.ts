import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";
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
