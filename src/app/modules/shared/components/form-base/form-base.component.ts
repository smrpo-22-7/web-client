import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";
import { isEmpty } from "lodash";

export abstract class FormBaseComponent {
   
    public hasError(control: AbstractControl | null, error?: keyof ValidationErrors | string): boolean {
        if (!control) {
            return true;
        }
        console.log(error);
        if (error) {
            return control.errors && control.errors[error] && control.touched;
        }
        return !isEmpty(control.errors) && control.touched;
    }
    
    public hasErrorNoTouch(control: AbstractControl | null, error?: keyof ValidationErrors | string): boolean {
        if (!control) {
            return true;
        }
        if (error) {
            return control.errors && control.errors[error];
        }
        return !isEmpty(control.errors);
    }
    
    /**
     * Recursively checks if control and it's children are invalid
     * @param control control to be checked
     * @return <code>true</code> if control or any of its children are invalid, <code>false</code> otherwise
     */
    public isInvalid(control: AbstractControl | null): boolean {
        if (!control) {
            return true;
        }
        if (control instanceof FormGroup) {
            const childControls = Object.keys(control.controls).map(controlName => {
                return this.isInvalid(control.controls[controlName]);
            });
            return control.invalid || childControls.some(ctrl => ctrl);
        } else if (control instanceof FormArray) {
            return control.invalid || control.controls.some(ctrl => this.isInvalid(ctrl));
        }
        return control.invalid;
    }
    
}
