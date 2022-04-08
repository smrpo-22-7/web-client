import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";
import {
    isStoryRegisterRequest,
    NavStateStatus, NavState, Codebooks
} from "@lib";
import { CodebookService, StorypriorityService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { NavContext } from "@context";
import { StoryPriorityLabel } from "@config/enums.config";
import { ActivatedRoute, Router } from "@angular/router";
import { validateUniqueStoryTitle } from "./validators";

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
    public testInputCtrl: FormControl;
    private destroy$ = new Subject<boolean>();
    
    constructor(private fb: FormBuilder,
                private storypriorityservice: StorypriorityService,
                private toastrService: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private codebookService: CodebookService,
                private nav: NavContext,) {
        super();
    }
    
    ngOnInit(): void {
        this.storyForm = this.fb.group({
            title: this.fb.control("", [Validators.required], [validateUniqueStoryTitle(this.route.snapshot.params["projectId"]!, this.storypriorityservice)]),
            description: this.fb.control("", [Validators.required]),
            tests: this.fb.array([]),
            priority: this.fb.control("", [Validators.required]),
            businessValue: this.fb.control(1, [Validators.min(1)]),
            timeEstimate: this.fb.control(null, [Validators.min(1)]),
        });
        this.testInputCtrl = this.fb.control("");
        
        this.priorities$ = this.codebookService.getCodebook(Codebooks.StoryPriority).pipe(
            takeUntil(this.destroy$),
        );
        
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
    }
    
    public addTest() {
        this.sysTestsCtrl.push(this.fb.control(this.testInputCtrl.value));
        this.testInputCtrl.reset();
    }
    
    public removeTest(index: number): void {
        this.sysTestsCtrl.removeAt(index);
    }
    
    public createStory(projectId: string) {
        const formValue = this.storyForm.getRawValue();
        formValue["tests"] = formValue["tests"].map((x: string) => ({ result: x }));
        if (isStoryRegisterRequest(formValue)) {
            this.storypriorityservice.createStory(formValue, projectId).pipe(take(1)).subscribe({
                next: () => {
                    this.toastrService.success("New story was added!", "Success!");
                    this.storyForm.reset();
                    this.router.navigate(["/projects", projectId, "stories"])
                },
                error: err => {
                    console.error(err);
                    this.toastrService.error("Error creating new story!", "Error!");
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
    
}
