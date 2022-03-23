import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { filter, Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { isUserRegisterRequest, ProjectRole, SysRole, User } from "@lib";
import { ProjectService, RoleService, UserService } from "@services";
//import { validateUniqueProjectName, validateProjectForm, validateUserRoles } from "./formvalidators";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { isProjectRegisterRequest } from "../../../../models/scrum-service-lib-v1/project.types";
import { ToastrService } from "ngx-toastr";
import {validateUniqueProjectName} from "../../../../utils/validators/project.validator";

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
    public check: boolean;

    constructor(private fb: FormBuilder,
                private roleService: RoleService,
                private projectService: ProjectService,
                private userService: UserService,
                private toastrService: ToastrService) {
        super();
    }

    ngOnInit(): void {
        this.projectForm = this.fb.group({
            name: this.fb.control("",[Validators.required], [validateUniqueProjectName(this.projectService)]),
            members: this.fb.array([]),
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

        this.check=true;
    }

    public isDisabled(idRole: string): boolean {
        const formValue = this.projectForm.getRawValue();
        for (let val of formValue["members"]) {
            if (val.projectRoleId == "product_owner" && idRole == "product_owner") {
                return true;
            }
        }
        for (let val of formValue["members"]) {
            if (val.projectRoleId =="scrum_master" && idRole == "scrum_master") {
                return true;
            }
        }
        return false;
    }

    public onUserSelect($event: User): void {
        this.userQueryCtrl.setValue("");
        const formValue = this.projectForm.getRawValue();
        for (let val of formValue["members"]) {
            if (val.userName == $event.username) {
                this.check=false;
                break;
            }
        }
        if (this.check) {
            this.usersCtrl.push(this.fb.group({
                userName: this.fb.control($event.username),
                userId: this.fb.control($event.id),
                projectRoleId: this.fb.control("member"),
            }));
        }
        this.check=true;
    }

    removeUser(index: number): void {
        this.usersCtrl.removeAt(index);
    }


    public createProject() {
        const formValue = this.projectForm.getRawValue();
        delete formValue["userQuery"];
        for (let val of formValue["members"]) {
            delete val.userName;
        }
        console.log(formValue);
        if (isProjectRegisterRequest(formValue)) {
            this.projectService.createProject(formValue).pipe(take(1)).subscribe({
                next: () => {
                    console.log("created!");
                    this.toastrService.success("New project was added!", "Success!");
                    this.projectForm.reset();
                    this.projectForm.controls["members"].reset();
                    window.location.reload();
                },
                error: err => {
                    console.log("NAPAKA!");
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

    public get usersCtrl(): FormArray {
        return this.projectForm.controls["members"] as FormArray;
    }

    public get userQueryCtrl(): FormControl {
        return this.projectForm.controls["userQuery"] as FormControl;
    }
}
