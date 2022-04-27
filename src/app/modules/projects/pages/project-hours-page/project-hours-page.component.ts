import { Component, OnDestroy, OnInit } from "@angular/core";
import { map, Observable, startWith, Subject, switchMap, takeUntil, combineLatest, BehaviorSubject } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TaskService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { TaskWorkSpent } from "@lib";
import { PageChangedEvent } from "ngx-bootstrap/pagination";


@Component({
    selector: "sc-project-hours-page",
    templateUrl: "./project-hours-page.component.html",
    styleUrls: ["./project-hours-page.component.scss"]
})
export class ProjectHoursPageComponent implements OnInit, OnDestroy {
    
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public hours$: Observable<EntityList<TaskWorkSpent>>;
    public projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private taskService: TaskService) {
    }
    
    ngOnInit(): void {
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            })
        );
        
        this.hours$ = combineLatest([this.projectId$, this.limit$, this.offset$]).pipe(
            switchMap((params: [string, number, number]) => {
                const [projectId, limit, offset] = params;
                return this.taskService.getUserTaskHours(projectId, limit, offset);
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
    
    public getHourId(index: number, task: TaskWorkSpent): string {
        return task.id;
    }
    
}
