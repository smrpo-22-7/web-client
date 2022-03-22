import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { isUserRegisterRequest, ProjectRole, SysRole, PriorityType } from "@lib";
import { ProjectService, RoleService, UserService, StorypriorityService } from "@services";
import { validateUniqueUsername } from "@utils";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";
import { validateUserForm, validateUserRoles } from "../../../admin/pages/user-form-page/validators";

@Component({
    selector: "sc-story-form-page",
    templateUrl: "./story-form-page.component.html",
    styleUrls: ["./story-form-page.component.scss"]
})
export class StoryFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {

    public priority$: Observable<PriorityType[]>;
    public storyForm: FormGroup;
    private destroy$ = new Subject<boolean>();

    constructor(private fb: FormBuilder,
                private storypriorityservice: StorypriorityService,
                private toastrService: ToastrService) {
        super();
    }

    ngOnInit(): void {
        this.storyForm = this.fb.group({
            name: this.fb.control(""),
            description: this.fb.control(""),
            test: this.fb.control(""),
            tests: this.fb.array([]),
            priority: this.fb.control(""),
            businessvalue: this.fb.control("")
        });

        this.priority$ = this.storypriorityservice.getPriorities().pipe(
            takeUntil(this.destroy$),
        );

    }

    public addTest(){
        const formValue = this.storyForm.getRawValue();
        console.log(formValue["test"]);
        console.log(this.fb.control(formValue["test"]));
        this.sysTestsCtrl.push(this.fb.control(formValue["test"]));
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }


    public get sysTestsCtrl(): FormArray {
        return this.storyForm.controls["tests"] as FormArray;
    }

    removeTest(index: number): void {
        this.sysTestsCtrl.removeAt(index);
        console.log(this.storyForm.controls["tests"]);
    }

}
