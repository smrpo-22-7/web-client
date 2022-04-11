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
import { CheckboxSelectEvent, NavState, NavStateStatus, StoriesFilter, Story } from "@lib";
import { ModalService, ProjectService, StoryService } from "@services";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { AddStoryDialogComponent } from "../../components/add-story-dialog/add-story-dialog.component";
import { ProjectRole } from "@config/roles.config";
import { NavContext } from "@context";


@Component({
    selector: "sc-project-stories-page",
    templateUrl: "./project-stories-page.component.html",
    styleUrls: ["./project-stories-page.component.scss"]
})
export class ProjectStoriesPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public stories$: Observable<EntityList<Story>>;
    public nav$: Observable<NavState>;
    private projectId$: Observable<string>;
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public filter$ = new BehaviorSubject<StoriesFilter>("ALL");
    public totalPages = 0;
    private refresh$ = new BehaviorSubject<void>(undefined);
    
    public storiesForm: FormArray;
    
    constructor(private projectService: ProjectService,
                private storyService: StoryService,
                private toastrService: ToastrService,
                private route: ActivatedRoute,
                private modalService: ModalService,
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
    
        this.stories$ = combineLatest([this.projectId$, this.filter$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((params: [string, StoriesFilter, number, number, void]) => {
                const [projectId, filter, offset, limit] = params;
                return this.projectService.getProjectStories(projectId, filter, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public onStorySelect($event: CheckboxSelectEvent<string>) {
        if ($event.checked) {
            this.storiesForm.push(this.fb.control($event.item));
        } else {
            this.storiesForm.controls.forEach((ctrl: AbstractControl, i: number) => {
                if (ctrl.value === $event.item) {
                    this.storiesForm.removeAt(i);
                    return;
                }
            });
        }
    }
    
    public openSprintModal() {
        const storyIds: string[] = this.storiesForm.getRawValue();
        this.projectId$.pipe(
            take(1),
        ).subscribe({
            next: (projectId: string) => {
                this.modalService.openModal(AddStoryDialogComponent, {
                    initialState: {
                        projectId,
                        storyIds,
                    },
                });
            }
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
}
