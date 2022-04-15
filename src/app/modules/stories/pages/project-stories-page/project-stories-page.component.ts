import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder } from "@angular/forms";
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
import { CheckboxSelectEvent, NavState, NavStateStatus, SprintStatus, StoriesFilter, Story } from "@lib";
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
    public stories$: Observable<EntityList<Story>>;
    public nav$: Observable<NavState>;
    public activeSprint$: Observable<SprintStatus>;
    public projectId$: Observable<string>;
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public filter$ = new BehaviorSubject<StoriesFilter>("ALL");
    public totalPages = 0;
    private refresh$ = new BehaviorSubject<void>(undefined);
    
    public storiesForm: FormArray;
    private selectedStories: Story[];
    
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
        this.selectedStories = [];
        
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
        
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId")!;
            })
        );
        
        this.activeSprint$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.sprintService.getActiveProjectsSprint(projectId);
            }),
            takeUntil(this.destroy$),
        );
    
        this.stories$ = combineLatest([this.projectId$, this.filter$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((params: [string, StoriesFilter, number, number, void]) => {
                const [projectId, filter, offset, limit] = params;
                return this.projectService.getProjectStories(projectId, filter, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public onStorySelect($event: CheckboxSelectEvent<Story>) {
        if ($event.checked) {
            this.storiesForm.push(this.fb.control($event.item.id));
            this.selectedStories.push($event.item);
        } else {
            this.storiesForm.controls.forEach((ctrl: AbstractControl, i: number) => {
                if (ctrl.value === $event.item.id) {
                    this.storiesForm.removeAt(i);
                    return;
                }
            });
            this.selectedStories = this.selectedStories.filter(story => story.id !== $event.item.id);
        }
    }
    
    public addToSprint(sprintId: string) {
        const storyIds: string[] = this.storiesForm.getRawValue();
        const storyMessage = storyIds.length === 1 ? "story": "stories";
        this.sprintService.addStoriesToSprint(sprintId, storyIds).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.toastrService.success(`${capitalize(storyMessage)} added to sprint!`, "Success!");
            },
            error: err => {
                this.toastrService.error(`Error adding ${storyMessage} to sprint!`, "Error!");
                console.error(err);
            },
        });
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public applyFilter(filter: StoriesFilter): void {
        this.filter$.next(filter);
        this.offset$.next(0);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public getStoryId(index: number, item: Story): string {
        return item.id;
    }
    
    public get storyPoints(): number {
        if (this.selectedStories.length === 0) {
            return 0;
        }
        return this.selectedStories.reduce((acc, elem) => {
            return acc + elem.timeEstimate;
        }, 0);
    }
}
