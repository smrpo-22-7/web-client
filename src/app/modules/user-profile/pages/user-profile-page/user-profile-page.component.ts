import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, take, tap } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { isUserProfile, UnauthorizedError, UserProfile, ValidationError } from "@lib";
import { UserService } from "@services";
import { validatePasswords } from "./password.validators";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";
import { PHONE_NUMBER_REGEX, validateUniqueUsername } from "@utils";
import { BaseError } from "@mjamsek/prog-utils";

@Component({
    selector: "sc-user-profile-page",
    templateUrl: "./user-profile-page.component.html",
    styleUrls: ["./user-profile-page.component.scss"]
})
export class UserProfilePageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public userProfile$: Observable<UserProfile>;
    
    public passwordForm: FormGroup;
    public profileForm: FormGroup;
    
    constructor(private userService: UserService,
                private fb: FormBuilder,
                private toastrService: ToastrService) {
        super();
    }
    
    ngOnInit(): void {
        this.passwordForm = this.fb.group({
            password: this.fb.control("", [Validators.required]),
            newPassword: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(128)]),
            confirmNewPassword: this.fb.control("", [Validators.required]),
        }, { validators: [validatePasswords] });
        
        this.profileForm = this.fb.group({
            username: this.fb.control({value: "", disabled: true}, [], [validateUniqueUsername(this.userService)]),
            firstName: this.fb.control("", [Validators.required]),
            lastName: this.fb.control("", [Validators.required]),
            email: this.fb.control("", [Validators.required, Validators.email]),
            phoneNumber: this.fb.control("", [Validators.pattern(PHONE_NUMBER_REGEX)]),
        });
        
        this.userProfile$ = this.userService.getUserProfile().pipe(
            tap((profile: UserProfile) => {
                this.profileForm.patchValue(profile, { emitEvent: false } );
            }),
            take(1),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public updateProfile() {
        const formValues = this.profileForm.getRawValue();
        if (isUserProfile(formValues)) {
            // @ts-ignore next-line
            delete formValues["username"];
            this.userService.updateUserProfile(formValues).pipe(
                take(1),
            ).subscribe({
                next: () => {
                    this.toastrService.success("User profile updated!", "Success!");
                },
                error: (err: BaseError) => {
                    if (err instanceof ValidationError) {
                        this.toastrService.error(err.message, "Error!");
                    } else {
                        console.error(err);
                        this.toastrService.error("Server error!", "Error!");
                    }
                },
            });
        } else {
            throw new TypeError("Not a user profile type!");
        }
    }
    
    public updatePasswords(): void {
        this.userService.updateUserCredentials(
            this.passwordCtrl.value,
            this.newPasswordCtrl.value,
        ).pipe(take(1)).subscribe({
            next: () => {
                this.toastrService.success("Password changed!", "Success!");
                this.passwordForm.reset();
            },
            error: (err) => {
                console.error(err);
                if (err instanceof ValidationError) {
                    this.toastrService.error(err.message, "Error!");
                } else if (err instanceof UnauthorizedError) {
                    this.toastrService.error("Invalid password!", "Error!");
                } else {
                    console.error(err);
                    this.toastrService.error("Server error!", "Error!");
                }
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
