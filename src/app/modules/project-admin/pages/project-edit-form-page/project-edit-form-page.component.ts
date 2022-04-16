import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    filter,
    forkJoin,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap,
} from "rxjs";
import { isProjectRegisterRequest, Project, ProjectMember, ProjectRole, User } from "@lib";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalService, ProjectService, RoleService, UserService } from "@services";
import { ToastrService } from "ngx-toastr";
import { mapToType, validateProject, validateUsersAndRoles } from "@utils";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ProjectRole as ProjectRoleConfig } from "@config/roles.config";

type RouteContext = {
    context: "PROJECT" | "ADMIN";
}

@Component({
    selector: "sc-project-edit-form-page",
    templateUrl: "./project-edit-form-page.component.html",
    styleUrls: ["./project-edit-form-page.component.scss"]
})
export class ProjectEditFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public roles$: Observable<ProjectRole[]>;
    public users$: Observable<User[]>;
    private routeContext$: Observable<RouteContext>;
    public projectForm: FormGroup;
    private destroy$ = new Subject<boolean>();
    private projectId$: Observable<string>;
    
    constructor(private fb: FormBuilder,
                private roleService: RoleService,
                private projectService: ProjectService,
                private userService: UserService,
                private route: ActivatedRoute,
                private modalService: ModalService,
                private router: Router,
                private toastrService: ToastrService) {
        super();
    }
    
    ngOnInit(): void {
        this.routeContext$ = this.route.data.pipe(
            startWith(this.route.snapshot.data),
            mapToType<RouteContext>(),
        );
        
        this.projectForm = this.fb.group({
            name: this.fb.control("", [Validators.required]),
            oldName: this.fb.control(""),
            members: this.fb.array([]),
            userQuery: this.fb.control(""),
        }, {
            validators: [validateUsersAndRoles],
            asyncValidators: [validateProject(this.projectService)],
        });
        
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
        
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
        );
        
        this.initializeForm();
    }
    
    public initializeForm(): void {
        this.projectId$.pipe(
            switchMap((projectId: string) => {
                return forkJoin([
                    this.projectService.getProject(projectId).pipe(
                        take(1),
                    ),
                    this.projectService.getProjectMembers(projectId, { limit: 100, offset: 0 }, "nowrap").pipe(
                        take(1),
                    ),
                ]);
            }),
            tap((results: [Project, ProjectMember[]]) => {
                const [project, members] = results;
                this.projectForm.patchValue({
                    name: project.name,
                    oldName: project.name,
                });
                this.usersCtrl.clear();
                members.forEach(member => {
                    this.usersCtrl.push(this.createUserFormGroup(
                        member.user!.username,
                        member.user!.id,
                        member.projectRole!.roleId
                    ));
                });
            }),
            take(1),
        ).subscribe({
            next: () => {
                this.projectForm.updateValueAndValidity();
                this.projectForm.markAsUntouched();
                this.projectForm.markAsPristine();
            },
        });
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
        this.usersCtrl.markAsDirty();
        this.usersCtrl.markAsTouched();
    }
    
    public removeUser(index: number): void {
        this.usersCtrl.removeAt(index);
        this.usersCtrl.markAsDirty();
        this.usersCtrl.markAsTouched();
    }
    
    public updateProject() {
        const formValue = this.projectForm.getRawValue();
        delete formValue["userQuery"];
        for (let val of formValue["members"]) {
            delete val.userName;
        }
        if (isProjectRegisterRequest(formValue)) {
            this.projectId$.pipe(
                switchMap((projectId: string) => {
                    return this.projectService.updateProject(projectId, formValue);
                }),
                take(1),
            ).subscribe({
                next: () => {
                    this.toastrService.success("Project updated!", "Success!");
                    this.navigateBack();
                },
                error: err => {
                    console.error(err);
                    this.toastrService.success("Error updating project!", "Error!");
                }
            });
        } else {
            throw new TypeError("Form does not match the required format!");
        }
    }
    
    public navigateBack() {
        forkJoin([
            this.routeContext$.pipe(take(1)),
            this.projectId$.pipe(take(1)),
        ]).subscribe(values => {
            const [ctx, projectId] = values;
            if (ctx.context === "ADMIN") {
                this.router.navigate(["/admin/projects"])
            } else if (ctx.context === "PROJECT") {
                this.router.navigate(["/projects", projectId]);
            } else {
                this.router.navigate(["/"]);
            }
        });
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    private createUserFormGroup(username: string, userId: string, roleId?: string): FormGroup {
        return this.fb.group({
            userName: this.fb.control(username),
            userId: this.fb.control(userId),
            projectRoleId: this.fb.control(roleId ?? "member"),
        });
    }
    
    public get usersCtrl(): FormArray {
        return this.projectForm.controls["members"] as FormArray;
    }
    
    public get userQueryCtrl(): FormControl {
        return this.projectForm.controls["userQuery"] as FormControl;
    }
    
}
