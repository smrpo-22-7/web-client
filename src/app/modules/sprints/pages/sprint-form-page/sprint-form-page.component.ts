import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";

import {
    isSprintRegisterRequest,
    NavState,
    NavStateStatus
} from "@lib";
import { SprintService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { validateDates, valiStartdate } from "./sprint.validators";
import {NavContext} from "@context";
import { getDaysFromDate, truncateTime } from "@utils";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";


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
                private router: Router,
                private nav: NavContext,) {
        super();
    }

    ngOnInit() {
        this.sprintForm = this.fb.group({
            title: this.fb.control("", [Validators.required]),
            startDate: this.fb.control(formatDate(getDaysFromDate(new Date(), 1), "yyyy-MM-dd", "sl-SI"), [Validators.required]),
            endDate: this.fb.control(formatDate(getDaysFromDate(new Date(), 2), "yyyy-MM-dd", "sl-SI"), [Validators.required]),
            expectedSpeed: this.fb.control(1,[Validators.required, Validators.min(1)])
        }, { validators: [validateDates, valiStartdate] } );

        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
    }

    public createSprint(projectId: string) {
        const formValue = this.sprintForm.getRawValue();
        if (isSprintRegisterRequest(formValue)) {
            formValue["startDate"] = truncateTime(new Date(formValue["startDate"]));
            formValue["endDate"] = truncateTime(new Date(formValue["endDate"]));
            this.sprintService.createSprint(formValue, projectId).pipe(take(1)).subscribe({
                next: () => {
                    this.toastrService.success("New sprint was made!", "Success!");
                    this.router.navigate(["/projects", projectId, "sprints"]);
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
    
    public onDateChange($event: Event, control: AbstractControl | null) {
        if (control && control instanceof FormControl) {
            const inputElem = $event.target as HTMLInputElement;
            control.patchValue(formatDate(inputElem.valueAsDate!, "yyyy-MM-dd", "sl-SI"));
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
