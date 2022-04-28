import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { ExtendedStory, ExtendedTask, NavState, SortOrder } from "@lib";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService, SprintService, TaskService } from "@services";
import { NavContext } from "@context";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

@Component({
    selector: "sc-sprint-tasks",
    templateUrl: "./sprint-tasks.component.html",
    styleUrls: ["./sprint-tasks.component.scss"]
})
export class SprintTasksComponent implements OnInit, OnDestroy {
    
    public nav$: Observable<NavState>;
    public tasks$: Observable<EntityList<ExtendedTask>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public refresh$ = new BehaviorSubject<void>(undefined);
    private destroy$ = new Subject<boolean>();
    public projectId$: Observable<string>;
    
    
    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private sprintService: SprintService,
                private taskService: TaskService,
                private nav: NavContext) {
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
            takeUntil(this.destroy$),
        );
    
        this.tasks$ = combineLatest([this.projectId$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((values: [string, number, number, void]) => {
                const [projectId, offset, limit] = values;
                return this.taskService.getProjectTasks(projectId, limit, offset);
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
