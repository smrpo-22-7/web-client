import { FormGroup, ValidationErrors } from "@angular/forms";

export function validatePasswords(formGroup: FormGroup): ValidationErrors | null {
    const newPassword: string = formGroup.controls["newPassword"].value;
    const confirmNewPassword: string = formGroup.controls["confirmNewPassword"].value;
    
    if (newPassword !== null && confirmNewPassword !== null) {
        if (newPassword.length > 0 && confirmNewPassword.length > 0) {
            if (newPassword !== confirmNewPassword) {
                return {
                    passwordMismatch: true,
                };
            }
        }
    }
    return null;
}
