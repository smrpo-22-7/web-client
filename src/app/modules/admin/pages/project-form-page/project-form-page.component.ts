import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { filter, Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { Router } from "@angular/router";

import { ProjectRole, User, isProjectRegisterRequest } from "@lib";
import { ProjectService, RoleService, UserService } from "@services";
import { validateUniqueProjectName, validateUsersAndRoles } from "@utils";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ProjectRole as ProjectRoleConfig } from "@config/roles.config";

@Component({
    selector: "sc-project-form-page",
    templateUrl: "./project-form-page.component.html",
    styleUrls: ["./project-form-page.component.scss"]
})
export class ProjectFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public roles$: Observable<ProjectRole[]>;
    public users$: Observable<User[]>;
    public projectForm: FormGroup;
    private destroy$ = new Subject<boolean>();
    
    constructor(private fb: FormBuilder,
                private roleService: RoleService,
                private projectService: ProjectService,
                private router: Router,
                private userService: UserService,
                private toastrService: ToastrService) {
        super();
    }
    
    ngOnInit(): void {
        this.projectForm = this.fb.group({
            name: this.fb.control("", [Validators.required], [validateUniqueProjectName(this.projectService)]),
            members: this.fb.array([]),
            userQuery: this.fb.control(""),
        }, { validators: validateUsersAndRoles });
        
        this.roles$ = this.projectService.getProjectRoles().pipe(
            takeUntil(this.destroy$),
        );
        
        this.users$ = this.userQueryCtrl.valueChanges.pipe(
            filter((value: string) => {
                return value.length > 0;
            }),
            switchMap((query: string) => {
                return this.userService.queryUser(query, 5);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public isDisabled(roleId: string): boolean {
        return this.usersCtrl.controls.some(ctrl => {
            return roleId !== ProjectRoleConfig.MEMBER && ctrl.get("projectRoleId")?.value === roleId;
        });
    }
    
    public onUserSelect($event: User): void {
        this.userQueryCtrl.setValue("");
        
        const existingUser = this.usersCtrl.controls.some(ctrl => ctrl.get("userId")?.value === $event.id);
        if (existingUser) {
            return;
        }
        
        this.usersCtrl.push(this.createUserFormGroup($event.username, $event.id));
    }
    
    private createUserFormGroup(username: string, userId: string): FormGroup {
        return this.fb.group({
            userName: this.fb.control(username),
            userId: this.fb.control(userId),
            projectRoleId: this.fb.control("member"),
        });
    }
    
    public removeUser(index: number): void {
        this.usersCtrl.removeAt(index);
    }
    
    public createProject() {
        const formValue = this.projectForm.getRawValue();
        delete formValue["userQuery"];
        for (let val of formValue["members"]) {
            delete val.userName;
        }
        if (isProjectRegisterRequest(formValue)) {
            this.projectService.createProject(formValue).pipe(take(1)).subscribe({
                next: () => {
                    this.toastrService.success("New project was added!", "Success!");
                    this.projectForm.reset();
                    this.usersCtrl.reset();
                    this.router.navigate(["/admin/projects"]);
                },
                error: err => {
                    console.error(err);
                    this.toastrService.error("Server error when creating project!", "Error!");
                }
            });
        } else {
            throw new TypeError("Form does not match the required format!");
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get usersCtrl(): FormArray {
        return this.projectForm.controls["members"] as FormArray;
    }
    
    public get userQueryCtrl(): FormControl {
        return this.projectForm.controls["userQuery"] as FormControl;
    }
}
