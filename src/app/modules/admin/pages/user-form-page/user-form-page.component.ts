import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { isUserRegisterRequest, SysRole } from "@lib";
import { RoleService, UserService } from "@services";
import { validateUniqueUsername } from "@utils";
import { validateUserForm, validateUserRoles } from "./validators";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";


@Component({
    selector: "sc-user-form-page",
    templateUrl: "./user-form-page.component.html",
    styleUrls: ["./user-form-page.component.scss"]
})
export class UserFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public roles$: Observable<SysRole[]>;
    public userForm: FormGroup;
    private destroy$ = new Subject<boolean>();

    constructor(private fb: FormBuilder,
                private roleService: RoleService,
                private userService: UserService,
                private toastrService: ToastrService) {
        super();
    }
    
    ngOnInit(): void {
        this.userForm = this.fb.group({
            username: this.fb.control("", [Validators.required], [validateUniqueUsername(this.userService)]),
            password: this.fb.control("", [Validators.required]),
            confirmPassword: this.fb.control("", [Validators.required]),
            firstName: this.fb.control("", [Validators.required]),
            lastName: this.fb.control("", [Validators.required]),
            email: this.fb.control("", [Validators.required]),
            grantedRoles: this.fb.array([], [validateUserRoles]),
        }, { validators: [validateUserForm] });
        
        this.roles$ = this.roleService.getAllSysRoles().pipe(
            takeUntil(this.destroy$)
        );
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
    
    public createUser() {
        const formValue = this.userForm.getRawValue();
        delete formValue["confirmPassword"];
        if (isUserRegisterRequest(formValue)) {
            this.userService.createUser(formValue).pipe(take(1)).subscribe({
                next: () => {
                    console.log("created!");
                    this.toastrService.success("New user was added!", "Success!");
                    this.userForm.reset();
                },
                error: err => {
                    console.error(err);
                }
            });
        } else {
            throw new TypeError("Form does not match the required format!");
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get sysRolesCtrl(): FormArray {
        return this.userForm.controls["grantedRoles"] as FormArray;
    }
    
}
