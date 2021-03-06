import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    BehaviorSubject,
    Observable,
    Subject,
    switchMap,
    takeUntil,
    tap,
    combineLatest
} from "rxjs";
import { ExtendedStory, NavState, SortOrder, SprintStatus, Story } from "@lib";
import { EntityList } from "@mjamsek/prog-utils";
import { ActivatedRoute } from "@angular/router";
import { ProjectService, SprintService, TaskService } from "@services";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { NavContext } from "@context";
import { routeParam } from "@utils";


@Component({
    selector: "sc-sprint-backlog-page",
    templateUrl: "./sprint-backlog-page.component.html",
    styleUrls: ["./sprint-backlog-page.component.scss"]
})
export class SprintBacklogPageComponent implements OnInit, OnDestroy {
    
    private projectId$: Observable<string>;
    private sprintId$ = new BehaviorSubject<string | null>(null);
    public nav$: Observable<NavState>;
    public sprint$: Observable<SprintStatus>;
    public stories$: Observable<EntityList<ExtendedStory>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public refresh$ = new BehaviorSubject<void>(undefined);
    public sort$ = new BehaviorSubject<SortOrder>(SortOrder.ASC);
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private sprintService: SprintService,
                private taskService: TaskService,
                private nav: NavContext,) {
    }
    
    ngOnInit(): void {
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
        
        this.projectId$ = routeParam("projectId", this.route);
        
        this.sprint$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.projectService.getProjectActiveSprint(projectId);
            }),
            tap((status: SprintStatus) => {
                if (status.active) {
                    this.sprintId$.next(status.sprintId);
                }
            }),
            takeUntil(this.destroy$),
        );
        
        this.stories$ = combineLatest([this.projectId$, this.sort$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((values: [string, SortOrder, number, number, void]) => {
                const [projectId, sort, offset, limit] = values;
                return this.projectService.getProjectStoriesExtended(projectId, {
                    limit: limit,
                    offset: offset,
                    filterAssigned: "true",
                    filterRealized: null,
                    numberIdSort: sort,
                });
            }),
            takeUntil(this.destroy$),
        );
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public updateData() {
        this.refresh$.next();
    }
    
    public getStoryId(index: number, item: Story): string {
        return item.id;
    }
    
}
