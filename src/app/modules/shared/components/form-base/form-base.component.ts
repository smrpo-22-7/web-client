import { AbstractControl, ValidationErrors } from "@angular/forms";
import { isEmpty } from "lodash";

export abstract class FormBaseComponent {
   
    public hasError(control: AbstractControl | null, error?: keyof ValidationErrors | string): boolean {
        if (!control) {
            return true;
        }
        if (error) {
            return control.errors && control.errors[error];
        }
        return !isEmpty(control.errors);
    }
    
}
