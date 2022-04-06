import { Component, OnDestroy, OnInit } from "@angular/core";
import { map, Observable, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { isUserProfile, UnauthorizedError, UserPreference, UserProfile, ValidationError } from "@lib";
import { AuthService, UserService } from "@services";
import { validatePasswords } from "./password.validators";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";
import { PHONE_NUMBER_REGEX } from "@utils";
import { BaseError } from "@mjamsek/prog-utils";
import { validateUsernameProfile } from "./validators";
import UserPreferenceKey = UserPreference.UserPreferenceKey;

@Component({
    selector: "sc-user-profile-page",
    templateUrl: "./user-profile-page.component.html",
    styleUrls: ["./user-profile-page.component.scss"]
})
export class UserProfilePageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public userProfile$: Observable<UserProfile>;
    public prefs$: Observable<Map<UserPreferenceKey, UserPreference>>;
    
    public passwordForm: FormGroup;
    public profileForm: FormGroup;
    public settingsForm: FormGroup;
    
    constructor(private userService: UserService,
                private fb: FormBuilder,
                private auth: AuthService,
                private toastrService: ToastrService) {
        super();
    }
    
    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            twoFa: this.fb.control(""),
        });
        
        this.passwordForm = this.fb.group({
            password: this.fb.control("", [Validators.required]),
            newPassword: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(128)]),
            confirmNewPassword: this.fb.control("", [Validators.required]),
        }, { validators: [validatePasswords] });
        
        this.profileForm = this.fb.group({
            username: this.fb.control("", [Validators.required]),
            oldUsername: this.fb.control(""),
            firstName: this.fb.control("", [Validators.required]),
            lastName: this.fb.control("", [Validators.required]),
            email: this.fb.control("", [Validators.required, Validators.email]),
            phoneNumber: this.fb.control("", [Validators.pattern(PHONE_NUMBER_REGEX)]),
        }, { asyncValidators: [validateUsernameProfile(this.userService)] });
        
        this.userProfile$ = this.userService.getUserProfile().pipe(
            tap((profile: UserProfile) => {
                this.profileForm.patchValue({
                    ...profile,
                    oldUsername: profile.username,
                }, { emitEvent: false });
            }),
            take(1),
        );
        
        this.prefs$ = this.userService.getUserPreferences([UserPreferenceKey.ENABLED_2FA]).pipe(
            tap((prefs: Map<UserPreferenceKey, UserPreference>) => {
                let value = false;
                const twoFaPref = prefs.get(UserPreferenceKey.ENABLED_2FA);
                if (twoFaPref) {
                    value = twoFaPref.value === "true";
                }
                this.settingsForm.patchValue({
                    twoFa: value,
                }, { emitEvent: false });
            }),
            takeUntil(this.destroy$),
        );
        
        this.twoFaCtrl.valueChanges.pipe(
            switchMap((value: boolean) => {
                return this.userService.updateUserPreference({
                    key: UserPreferenceKey.ENABLED_2FA,
                    value: value.toString(),
                }).pipe(
                    map(() => value),
                );
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: value => {
                const message = `2FA was ${value ? "enabled" : "disabled"}!`;
                if (value) {
                    this.toastrService.success(message, "Success!");
                } else {
                    this.toastrService.warning(message, "Success!");
                }
            },
            error: err => {
                console.error(err);
                this.toastrService.error("Error updating settings!", "Error!");
            }
        })
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public updateProfile() {
        const formValues: Record<string, any> = this.profileForm.getRawValue();
        delete formValues["oldUsername"];
        if (isUserProfile(formValues)) {
            this.userService.updateUserProfile(formValues).pipe(
                take(1),
            ).subscribe({
                next: () => {
                    this.toastrService.success("User profile updated!", "Success!");
                    this.auth.refreshTokens().pipe(take(1)).subscribe(() => {
                    
                    });
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
    
    public get twoFaCtrl(): FormControl {
        return this.settingsForm.controls["twoFa"] as FormControl;
    }
}
