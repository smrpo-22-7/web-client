import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
    BehaviorSubject,
    combineLatest,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
} from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import {
    BoolOptFilter,
    CheckboxSelectEvent,
    ExtendedStory,
    NavState,
    NavStateStatus,
    SortOrder,
    SprintStatus,
    Story
} from "@lib";
import { ProjectService, SprintService, StoryService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ProjectRole } from "@config/roles.config";
import { NavContext } from "@context";
import { capitalize } from "@utils";


@Component({
    selector: "sc-project-stories-page",
    templateUrl: "./project-stories-page.component.html",
    styleUrls: ["./project-stories-page.component.scss"]
})
export class ProjectStoriesPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public stories$: Observable<EntityList<ExtendedStory>>;
    public nav$: Observable<NavState>;
    public activeSprint$: Observable<SprintStatus>;
    private refreshActiveSprint$ = new BehaviorSubject<void>(undefined);
    public projectId$: Observable<string>;
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public sort$ = new BehaviorSubject<SortOrder>(SortOrder.ASC);
    public filterRealized$ = new BehaviorSubject<BoolOptFilter>("false");
    public filterAssigned$ = new BehaviorSubject<BoolOptFilter>(null);
    private refresh$ = new BehaviorSubject<void>(undefined);
    
    public storiesForm: FormArray;
    public storyPoints$: Observable<number>;
    
    constructor(private projectService: ProjectService,
                private storyService: StoryService,
                private sprintService: SprintService,
                private toastrService: ToastrService,
                private route: ActivatedRoute,
                private nav: NavContext,
                private fb: FormBuilder) {
        super();
    }
    
    ngOnInit(): void {
        this.storiesForm = this.fb.array([]);
        
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
        
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId")!;
            })
        );
        
        this.registerActiveSprint();
        this.registerPaginatedList();
        this.registerStoryPoints();
    }
    
    private registerPaginatedList(): void {
        this.stories$ = combineLatest([
            this.projectId$,
            this.sort$,
            this.filterRealized$,
            this.filterAssigned$,
            this.offset$,
            this.limit$,
            this.refresh$,
        ]).pipe(
            switchMap((params: [string, SortOrder, BoolOptFilter, BoolOptFilter, number, number, void]) => {
                const [projectId, sort, filterRealized, filterAssigned, offset, limit] = params;
                return this.projectService.getProjectStoriesExtended(projectId, {
                    limit: limit,
                    offset: offset,
                    filterAssigned: filterAssigned,
                    filterRealized: filterRealized,
                    numberIdSort: sort,
                });
            }),
            takeUntil(this.destroy$)
        );
    }
    
    private registerActiveSprint(): void {
        this.activeSprint$ = combineLatest([
            this.projectId$,
            this.refreshActiveSprint$,
        ]).pipe(
            switchMap((values: [string, void]) => {
                const [projectId] = values;
                return this.sprintService.getActiveProjectsSprint(projectId);
            }),
            takeUntil(this.destroy$),
        );
    }
    
    private registerStoryPoints(): void {
        this.storyPoints$ = this.storiesForm.valueChanges.pipe(
            map((values: any) => {
                if (values.length === 0) {
                    return 0;
                }
                return values.reduce((acc: number, elem: any) => {
                    return acc + parseInt(elem.timeEstimate);
                }, 0);
            }),
            takeUntil(this.destroy$),
        );
    }
    
    public onStorySelect($event: CheckboxSelectEvent<Story>) {
        if ($event.checked) {
            this.storiesForm.push(this.storyToFormGroup($event.item));
        } else {
            this.storiesForm.controls.forEach((ctrl: AbstractControl, i: number) => {
                const storyId = ctrl.get("id")?.value;
                if (storyId === $event.item.id) {
                    this.storiesForm.removeAt(i);
                    return;
                }
            });
        }
    }
    
    public addToSprint(sprintId: string) {
        const storyIds: string[] = this.storiesForm.controls.map(ctrl => {
            return ctrl.get("id")?.value;
        });
        const storyMessage = storyIds.length === 1 ? "story" : "stories";
        this.sprintService.addStoriesToSprint(sprintId, storyIds).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.refresh$.next();
                this.storiesForm.clear();
                this.toastrService.success(`${capitalize(storyMessage)} added to sprint!`, "Success!");
            },
            error: err => {
                this.toastrService.error(`Error adding ${storyMessage} to sprint!`, "Error!");
                console.error(err);
            },
        });
    }

    // public addToRealized() {
    //     const storyIds: string[] = this.storiesForm.controls.map(ctrl => {
    //         return ctrl.get("id")?.value;
    //     });
    //     const storyMessage = storyIds.length === 1 ? "story" : "stories";
    //     this.storyService.addStoriesToSprint(storyIds).pipe(
    //         take(1)
    //     ).subscribe({
    //         next: () => {
    //             this.refresh$.next();
    //             this.refreshActiveSprint$.next();
    //             this.storiesForm.clear();
    //             this.toastrService.success(`${capitalize(storyMessage)} added to sprint!`, "Success!");
    //         },
    //         error: err => {
    //             this.toastrService.error(`Error adding ${storyMessage} to sprint!`, "Error!");
    //             console.error(err);
    //         },
    //     });
    // }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public toggleSort() {
        this.sort$.next(this.oppositeSort);
        this.offset$.next(0);
    }
    
    public toggleFilter(value: BoolOptFilter, filter: BehaviorSubject<BoolOptFilter>) {
        if (filter.value === value) {
            filter.next(null);
        } else {
            filter.next(value);
        }
        this.offset$.next(0);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public getStoryId(index: number, item: Story): string {
        return item.id;
    }
    
    private storyToFormGroup(story: Story): FormGroup {
        return this.fb.group({
            id: this.fb.control(story.id),
            timeEstimate: this.fb.control(parseInt(story.timeEstimate as any)),
        });
    }
    
    public get oppositeSort(): SortOrder {
        return this.sort$.value === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    public updateData(): void {
        this.refresh$.next();
    }
    
}
