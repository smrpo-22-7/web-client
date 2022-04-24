import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBaseComponent} from "@shared/components/form-base/form-base.component";
import {
    Codebooks,
    isStoryRegisterRequest,
    NavState,
    NavStateStatus,
    Story,
    StoryRegisterRequest,
    UserProfile
} from "@lib";
import {map, Observable, startWith, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {StoryPriorityLabel} from "@config/enums.config";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CodebookService, StoryService} from "@services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {NavContext} from "@context";
import {validateUniqueStoryTitle, validateUniqueStoryTitleOne} from "../story-form-page/validators";

@Component({
  selector: 'sc-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.scss']
})
export class EditStoryComponent extends FormBaseComponent implements OnInit, OnDestroy {

    public storyId$: Observable<string>;

    public navStates = NavStateStatus;
    public nav$: Observable<NavState>;
    public priorities$: Observable<string[]>;
    public priorityLabels = StoryPriorityLabel;

    public storyForm: FormGroup;
    public testInputCtrl: FormControl;
    private destroy$ = new Subject<boolean>();

    constructor(private fb: FormBuilder,
                private storypriorityservice: StoryService,
                private toastrService: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private codebookService: CodebookService,
                private nav: NavContext,
                private storyService: StoryService) {
        super();
    }

    ngOnInit(): void {
        this.storyForm = this.fb.group({
            title: this.fb.control("", [Validators.required]),
            oldtitle: this.fb.control(""),
            description: this.fb.control("", [Validators.required]),
            tests: this.fb.array([]),
            priority: this.fb.control("", [Validators.required]),
            businessValue: this.fb.control(1, [Validators.min(1), Validators.max(10)]),
            timeEstimate: this.fb.control(null, [Validators.min(1)]),
        } , { asyncValidators: [validateUniqueStoryTitleOne(this.route.snapshot.params["projectId"]!, this.storypriorityservice)] } );

        this.testInputCtrl = this.fb.control("");

        this.priorities$ = this.codebookService.getCodebook(Codebooks.StoryPriority).pipe(
            takeUntil(this.destroy$),
        );

        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );

        this.storyId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("storyId") as string;
            }),
        );

        this.storyId$.pipe(
            switchMap((storyId: string) => {
                return this.storyService.getStoryById(storyId);
            }),
            tap((story: StoryRegisterRequest) => {
                this.storyForm.patchValue({
                    ...story,
                    oldtitle: story.title
                }, { emitEvent: false });

                this.sysTestsCtrl.clear();
                story.tests.forEach(role => {
                    console.log(role.result);
                    this.sysTestsCtrl.push(this.fb.control(role.result));
                });
            }),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.storyForm.updateValueAndValidity();
            this.storyForm.markAsUntouched();
            this.storyForm.markAsPristine();
        });
    }

    public addTest() {
        if (this.testInputCtrl.value) {
            this.sysTestsCtrl.push(this.fb.control(this.testInputCtrl.value));
            this.testInputCtrl.reset();
        } else {
            this.toastrService.error("Test can't be empty!", "Error!")
        }
    }

    public removeTest(index: number): void {
        this.sysTestsCtrl.removeAt(index);
    }

    public editStory(projectId: string) {
        const formValue = this.storyForm.getRawValue();
        formValue["tests"] = formValue["tests"].map((x: string) => ({ result: x }));
        if (isStoryRegisterRequest(formValue)) {
            this.storyId$.pipe(
                switchMap((storyId: string) => {
                    return this.storyService.editStory(formValue, storyId);
                }),
                take(1),
            ).subscribe({
                next: () => {
                    this.toastrService.success("Story was updated!", "Success!");
                    this.storyForm.reset();
                    this.router.navigate(["/projects", projectId, "stories"]);
                },
                error: err => {
                    console.error(err);
                    this.toastrService.error("Error updating the story!", "Error!");
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
