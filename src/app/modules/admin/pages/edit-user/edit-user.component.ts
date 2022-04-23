import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, startWith, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {isUserProfile, SysRole, UnauthorizedError, UserProfile, ValidationError} from "@lib";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService, RoleService, UserService} from "@services";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PHONE_NUMBER_REGEX, validateUniqueUsername} from "@utils";
import {validateUserForm, validateUserRoles} from "../user-form-page/validators";
import {FormBaseComponent} from "@shared/components/form-base/form-base.component";
import {validatePasswords} from "../../../user-profile/pages/user-profile-page/password.validators";
import {BaseError} from "@mjamsek/prog-utils";
import {validateUsernameProfile} from "../../../user-profile/pages/user-profile-page/validators";


@Component({
  selector: 'sc-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent extends FormBaseComponent implements OnInit, OnDestroy {

    public userId: string;
    public roles$: Observable<SysRole[]>;
    public editUserForm: FormGroup;
    public passwordForm: FormGroup;
    private destroy$ = new Subject<boolean>();
    public userProfile$: Observable<UserProfile>;


    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private roleService: RoleService,
                private router: Router,
                private userService: UserService,
                private toastrService: ToastrService,
                private auth: AuthService,) {
        super();
    }

    ngOnInit(): void {
        this.editUserForm = this.fb.group({
            username: this.fb.control("", [Validators.required]),
            oldUsername: this.fb.control(""),
            firstName: this.fb.control("", [Validators.required]),
            lastName: this.fb.control("", [Validators.required]),
            email: this.fb.control("", [Validators.required, Validators.email]),
            grantedRoles: this.fb.array([], [validateUserRoles]),
            phoneNumber: this.fb.control("", [Validators.pattern(PHONE_NUMBER_REGEX)]),
        }, { asyncValidators: [validateUsernameProfile(this.userService)] });

        this.passwordForm = this.fb.group({
            password: this.fb.control("", [Validators.required]),
            newPassword: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(128)]),
            confirmNewPassword: this.fb.control("", [Validators.required]),
        }, { validators: [validatePasswords] });

        this.roles$ = this.roleService.getAllSysRoles().pipe(
            takeUntil(this.destroy$)
        );

        this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramap: ParamMap) => {
                return paramap.get("userId") as string;
            }),
            switchMap((userId: string) => {
                return this.userService.getUserById(userId);
            }),
            tap((profile: UserProfile) => {
                this.editUserForm.patchValue({
                    ...profile,
                    oldUsername: profile.username
                }, { emitEvent: false });
                const roles = profile.grantedRoles;
                this.sysRolesCtrl.clear();
                roles.forEach(role => {
                    // this.oldSysRolesCtrl.push(this.createRoleFormGroup(
                    // role
                    //)
                    //);
                    this.sysRolesCtrl.push(this.fb.control(role));
                });

            }),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.editUserForm.updateValueAndValidity();
            this.editUserForm.markAsUntouched();
            this.editUserForm.markAsPristine();
        });



    }






    public onRoleSelect($event: Event): void {
        const checkboxElement = $event.target as HTMLInputElement;
        if (checkboxElement.checked) {
            this.sysRolesCtrl.push(this.fb.control(checkboxElement.value));
        } else {
            this.sysRolesCtrl.controls.forEach((ctrl: AbstractControl, i: number) => {
                if (ctrl.value === checkboxElement.value) {
                    this.sysRolesCtrl.removeAt(i);
                    return;
                }
            });
        }
        this.sysRolesCtrl.markAsDirty();
        this.sysRolesCtrl.markAsTouched();
    }



    public updateUserProfile() {
        const formValues: Record<string, any> = this.editUserForm.getRawValue();
        delete formValues["oldRoles"];
        //delete formValues["password"];
        //delete formValues["confirmPassword"];
        if (isUserProfile(formValues)) {
            this.userService.adminUpdateUserProfile(this.userId, formValues).pipe(
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
        this.userService.updateUserCredentialsbyId(
            this.passwordCtrl.value,
            this.newPasswordCtrl.value,
            this.userId
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
                    this.toastrService.error("Old password is not correct!", "Error!");
                } else {
                    console.error(err);
                    this.toastrService.error("Server error!", "Error!");
                }
            }
        });
    }



    ngOnDestroy() {
        this.destroy$.next(true);
    }

    public get sysRolesCtrl(): FormArray {
        console.log(this.editUserForm.controls["grantedRoles"]);
        return this.editUserForm.controls["grantedRoles"] as FormArray;
    }


    public get passwordCtrl(): FormControl {
        return this.passwordForm.controls["password"] as FormControl;
    }

    public get newPasswordCtrl(): FormControl {
        return this.passwordForm.controls["newPassword"] as FormControl;
    }



}
