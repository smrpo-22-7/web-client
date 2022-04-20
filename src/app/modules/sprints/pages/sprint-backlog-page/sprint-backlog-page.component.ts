import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    BehaviorSubject,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    takeUntil,
    tap,
    combineLatest
} from "rxjs";
import { ExtendedStory, NavState, SortOrder, SprintStatus } from "@lib";
import { EntityList } from "@mjamsek/prog-utils";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService, SprintService } from "@services";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { NavContext } from "@context";


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
    public sort$ = new BehaviorSubject<SortOrder>(SortOrder.ASC);
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private sprintService: SprintService,
                private nav: NavContext,) {
    }
    
    ngOnInit(): void {
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
        
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
        );
        
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
        
        this.stories$ = combineLatest([this.projectId$, this.sort$, this.offset$, this.limit$]).pipe(
            switchMap((values: [string, SortOrder, number, number]) => {
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
    
}
