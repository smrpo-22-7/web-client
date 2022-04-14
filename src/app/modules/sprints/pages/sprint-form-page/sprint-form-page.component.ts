import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { filter, map, Observable, startWith, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";

import {
    isSprintRegisterRequest,
    NavState,
    NavStateStatus
} from "@lib";
import { ProjectService, SprintService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import {
    irregularVelocityWarning,
    validateDatesOverlap,
    validateNotBeforeToday,
    validateSprintDateConflicts
} from "./sprint.validators";
import { NavContext } from "@context";
import { getDaysFromDate, parseUTCDate, truncateTime } from "@utils";


@Component({
    selector: "sc-sprint-form-page",
    templateUrl: "./sprint-form-page.component.html",
    styleUrls: ["./sprint-form-page.component.scss"]
})
export class SprintFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public datePickerConfig: Partial<BsDatepickerConfig> = {
        daysDisabled: [6],
        containerClass: "theme-default datepicker-theme",
        dateInputFormat: "DD.MM.YYYY"
    }
    
    public sprintForm: FormGroup;
    public showVelocityWarning: boolean = false;
    public navStates = NavStateStatus;
    public nav$: Observable<NavState>;
    private projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private fb: FormBuilder,
                private toastrService: ToastrService,
                private sprintService: SprintService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router,
                private nav: NavContext,) {
        super();
    }
    
    ngOnInit() {
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            filter((paramMap: ParamMap) => paramMap.has("projectId")),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
        );
        
        this.sprintForm = this.fb.group({
            title: this.fb.control("", [Validators.required]),
            startDate: this.fb.control(new Date(), [Validators.required, validateNotBeforeToday]),
            endDate: this.fb.control(getDaysFromDate(new Date(), 1), [Validators.required]),
            expectedSpeed: this.fb.control(1, [Validators.required, Validators.min(1)])
        }, {
            validators: [validateDatesOverlap],
            asyncValidators: [validateSprintDateConflicts(this.projectId$, this.sprintService)],
        });
        
        this.sprintForm.valueChanges.pipe(
            switchMap(() => {
                return irregularVelocityWarning(this.projectId$, this.projectService)(this.sprintForm).pipe(
                    tap((issueWarning: boolean) => {
                        this.showVelocityWarning = issueWarning;
                    }),
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe();
        
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
    }
    
    public createSprint(projectId: string) {
        const formValue = this.sprintForm.getRawValue();
        if (isSprintRegisterRequest(formValue)) {
            formValue["startDate"] = truncateTime(parseUTCDate(formValue["startDate"]));
            formValue["endDate"] = truncateTime(parseUTCDate(formValue["endDate"]));
            this.sprintService.createSprint(formValue, projectId).pipe(take(1)).subscribe({
                next: () => {
                    this.toastrService.success("New sprint was created!", "Success!");
                    this.router.navigate(["/projects", projectId, "sprints"]);
                },
                error: err => {
                    console.error(err);
                    this.toastrService.error("Error creating sprint!", "Error!");
                }
            });
        } else {
            throw new TypeError("Something wrong with form!");
        }
    }
    
    resetForm() {
        this.sprintForm.reset({
            startDate: new Date(),
            endDate: getDaysFromDate(new Date(), 1),
            expectedSpeed: 1,
        });
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}
