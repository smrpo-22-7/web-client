import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { UserProfile } from "@lib";
import { UserService } from "@services";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { validatePasswords } from "./password.validators";

@Component({
    selector: "sc-user-profile-page",
    templateUrl: "./user-profile-page.component.html",
    styleUrls: ["./user-profile-page.component.scss"]
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public userProfile$: Observable<UserProfile>;
    
    public passwordForm: FormGroup;
    
    constructor(private userService: UserService,
                private fb: FormBuilder) {
    }
    
    ngOnInit(): void {
        this.passwordForm = this.fb.group({
            password: this.fb.control("", [Validators.required]),
            newPassword: this.fb.control("", [Validators.required]),
            confirmNewPassword: this.fb.control("", [Validators.required]),
        }, {validators: [validatePasswords]});
        
        this.userProfile$ = this.userService.getUserProfile().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public updatePasswords(): void {
        
        
        this.userService.updateUserCredentials(
            this.passwordCtrl.value,
            this.newPasswordCtrl.value,
        ).pipe(take(1)).subscribe({
            next: () => {
                console.log("Password updated!");
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    
    public get passwordCtrl(): FormControl {
        return this.passwordForm.controls["password"] as FormControl;
    }
    
    public get newPasswordCtrl(): FormControl {
        return this.passwordForm.controls["newPassword"] as FormControl;
    }
}
