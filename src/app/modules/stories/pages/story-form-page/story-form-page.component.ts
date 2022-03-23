import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";
import {
    isStoryRegisterRequest,
    NavStateStatus, NavState, Codebooks
} from "@lib";
import { CodebookService, StorypriorityService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import {NavContext} from "@context";
import { StoryPriorityLabel } from "@config/enums.config";

@Component({
    selector: "sc-story-form-page",
    templateUrl: "./story-form-page.component.html",
    styleUrls: ["./story-form-page.component.scss"]
})
export class StoryFormPageComponent extends FormBaseComponent implements OnInit, OnDestroy {

    public navStates = NavStateStatus;
    public nav$: Observable<NavState>;
    public priorities$: Observable<string[]>;
    public priorityLabels = StoryPriorityLabel;
    
    public storyForm: FormGroup;
    private destroy$ = new Subject<boolean>();

    constructor(private fb: FormBuilder,
                private storypriorityservice: StorypriorityService,
                private toastrService: ToastrService,
                private codebookService: CodebookService,
                private nav: NavContext,) {
        super();
    }

    ngOnInit(): void {
        this.storyForm = this.fb.group({
            title: this.fb.control("", [Validators.required]),
            description: this.fb.control("", [Validators.required]),
            result: this.fb.control(""),
            tests: this.fb.array([]),
            priority: this.fb.control("", [Validators.required]),
            businessValue: this.fb.control(1, [Validators.min(1)]),
            timeEstimate: this.fb.control(1),
        });
        
        this.priorities$ = this.codebookService.getCodebook(Codebooks.StoryPriority).pipe(
            takeUntil(this.destroy$),
        );

        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );

    }

    public addTest(){
        const formValue = this.storyForm.getRawValue();
        this.sysTestsCtrl.push(this.fb.control(formValue["result"]));
        this.storyForm.controls["result"].reset();
    }

    public createStory(projectId: string) {
        const formValue = this.storyForm.getRawValue();
        delete formValue["result"];
        formValue["tests"] = formValue["tests"].map((x: string) => ({ ["result"]: x }));
        if (isStoryRegisterRequest(formValue)) {
            this.storypriorityservice.createStory(formValue, projectId).pipe(take(1)).subscribe({
                next: () => {
                    this.toastrService.success("New story was added!", "Success!");
                    this.storyForm.reset();
                    window.location.reload();
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


    public get sysTestsCtrl(): FormArray {
        return this.storyForm.controls["tests"] as FormArray;
    }

    removeTest(index: number): void {
        this.sysTestsCtrl.removeAt(index);
    }

}
