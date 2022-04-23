import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, take, takeUntil, tap} from "rxjs";
import {isUserProfile, SysRole, UnauthorizedError, UserProfile, ValidationError} from "@lib";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService, RoleService, UserService} from "@services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {validateUniqueUsername} from "@utils";
import {validateUserForm, validateUserRoles} from "../user-form-page/validators";
import {FormBaseComponent} from "@shared/components/form-base/form-base.component";
import {validatePasswords} from "../../../user-profile/pages/user-profile-page/password.validators";
import {BaseError} from "@mjamsek/prog-utils";


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
                private roleService: RoleService,
                private router: Router,
                private userService: UserService,
                private toastrService: ToastrService,
                private auth: AuthService,) {
        super();
    }

    ngOnInit(): void {
        this.editUserForm = this.fb.group({
            username: this.fb.control("", [Validators.required], [validateUniqueUsername(this.userService)]),
            firstName: this.fb.control("", [Validators.required]),
            lastName: this.fb.control("", [Validators.required]),
            email: this.fb.control("", [Validators.required, Validators.email]),
            grantedRoles: this.fb.array([], [validateUserRoles]),
            oldRoles: this.fb.array([], [validateUserRoles]),
        }, );

        this.passwordForm = this.fb.group({
            password: this.fb.control("", [Validators.required]),
            newPassword: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(128)]),
            confirmNewPassword: this.fb.control("", [Validators.required]),
        }, { validators: [validatePasswords] });

        this.roles$ = this.roleService.getAllSysRoles().pipe(
            takeUntil(this.destroy$)
        );

        this.userProfile$ = this.userService.getUserById(this.userId).pipe(
            tap((profile: UserProfile) => {
                this.editUserForm.patchValue({
                    ...profile,
                }, { emitEvent: false });
                const roles = profile.grantedRoles;
                this.oldSysRolesCtrl.clear();
                roles.forEach(role => {
                    // this.oldSysRolesCtrl.push(this.createRoleFormGroup(
                    // role
                    //)
                //);
                    this.oldSysRolesCtrl.push(this.fb.control(role));
                });

            }),
            take(1),
        );


    }



    private createRoleFormGroup(roleId: string): FormGroup {
        return this.fb.group({
            idRole: this.fb.control(roleId),
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
        return this.editUserForm.controls["grantedRoles"] as FormArray;
    }

    public get oldSysRolesCtrl(): FormArray {
        return this.editUserForm.controls["oldRoles"] as FormArray;
    }

    public get passwordCtrl(): FormControl {
        return this.passwordForm.controls["password"] as FormControl;
    }

    public get newPasswordCtrl(): FormControl {
        return this.passwordForm.controls["newPassword"] as FormControl;
    }

    public get sysRolesCtrlOld(): FormArray {
        return this.editUserForm.controls["oldRoles"] as FormArray;
    }

}
