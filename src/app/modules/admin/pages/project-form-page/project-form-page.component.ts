import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { filter, Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { isUserRegisterRequest, ProjectRole, SysRole, User } from "@lib";
import { ProjectService, RoleService, UserService } from "@services";
//import { validateUniqueProjectName, validateProjectForm, validateUserRoles } from "./formvalidators";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";

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
                private userService: UserService) {
        super();
    }

    ngOnInit(): void {
        //this.userForm = this.fb.group({
        //projectname: this.fb.control("", [Validators.required], [validateUniqueProjectName(this.userService)]),
        //users: this.fb.array([], [Validators.required]),
        //}, //{ validators: [validateProjectForm] });
        this.projectForm = this.fb.group({
            name: this.fb.control(""),
            users: this.fb.array([]),
            userQuery: this.fb.control(""),
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
    }

    public onUserSelect($event: User): void {
        this.userQueryCtrl.setValue("");
        this.usersCtrl.push(this.fb.group({
            userName: this.fb.control($event.username),
            userId: this.fb.control($event.id),
            role: this.fb.control("member"),
        }));
    }

    removeUser(index: number): void {
        this.usersCtrl.removeAt(index);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }

    public get usersCtrl(): FormArray {
        return this.projectForm.controls["users"] as FormArray;
    }

    public get userQueryCtrl(): FormControl {
        return this.projectForm.controls["userQuery"] as FormControl;
    }
}
