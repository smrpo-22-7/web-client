import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import {
    isUserRegisterRequest,
    ProjectRole,
    SysRole,
    PriorityType,
    isSprintRegisterRequest,
    NavState,
    NavStateStatus
} from "@lib";
import { ProjectService, RoleService, UserService, StorypriorityService, SprintService } from "@services";
import { validateUniqueUsername } from "@utils";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";
import { validateUserForm, validateUserRoles } from "../../../admin/pages/user-form-page/validators";
import {validatePasswords} from "../../../user-profile/pages/user-profile-page/password.validators";
import { validateDates, valiStartdate } from "./sprint.validators";
import {NavContext} from "@context";
import {startCase} from "lodash";


@Component({
    selector: "sc-sprint-form-page",
    templateUrl: "./sprint-form-page.component.html",
    styleUrls: ["./sprint-form-page.component.scss"]
})
export class SprintFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy{

    public sprintForm: FormGroup;
    public navStates = NavStateStatus;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();

    constructor(private fb: FormBuilder,
                private toastrService: ToastrService,
                private sprintService: SprintService,
                private nav: NavContext,) {
        super();
    }

    ngOnInit() {
        this.sprintForm = this.fb.group({
            title: this.fb.control("", [Validators.required]),
            startDate: this.fb.control("", [Validators.required]),
            endDate: this.fb.control("", [Validators.required]),
            expectedSpeed: this.fb.control(1,[Validators.required, Validators.min(1)])
        }, { validators: [validateDates, valiStartdate] } );

        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
    }

    public createSprint(projectId: string) {
        const formValue = this.sprintForm.getRawValue();
        //daj se v pravo obliko ISO
        if (isSprintRegisterRequest(formValue)) {
            //const startDateISO = new Date(formValue["startDate"]); //.toISOString();
            //const endDateISO = new Date(formValue["endDate"]); //.toISOString();
            //formValue["startDate"] = startDateISO;
            //formValue["endDate"] = endDateISO;
            this.sprintService.createSprint(formValue, projectId).pipe(take(1)).subscribe({
                next: () => {
                    console.log("created sprint!");
                    this.toastrService.success("New sprint was made!", "Success!");
                    this.sprintForm.reset();
                    window.location.reload();
                },
                error: err => {
                    console.error(err);
                    this.toastrService.error("Sprint se prekriva!", "Error!");
                }
            });
        } else {
            throw new TypeError("Something wrong with form!");
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
