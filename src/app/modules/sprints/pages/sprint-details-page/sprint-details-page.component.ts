import { Component, OnDestroy, OnInit } from "@angular/core";
import { SprintService } from "@services";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { Sprint, Story } from "@lib";
import { EntityList } from "@mjamsek/prog-utils";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { routeParam } from "@utils";

@Component({
    selector: "sc-sprint-details-page",
    templateUrl: "./sprint-details-page.component.html",
    styleUrls: ["./sprint-details-page.component.scss"]
})
export class SprintDetailsPageComponent implements OnInit, OnDestroy {
    
    private sprintId$: Observable<string>;
    public sprint$: Observable<Sprint>;
    public stories$: Observable<EntityList<Story>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    private destroy$ = new Subject<boolean>();
    
    constructor(private sprintService: SprintService,
                private route: ActivatedRoute) {
    }
    
    ngOnInit(): void {
        this.sprintId$ = routeParam<string>("sprintId", this.route);
        
        this.sprint$ = this.sprintId$.pipe(
            switchMap((sprintId: string) => {
                return this.sprintService.getSprint(sprintId);
            }),
            takeUntil(this.destroy$)
        );
        this.stories$ = combineLatest([this.sprintId$, this.offset$, this.limit$]).pipe(
            switchMap((routeParams: [string, number, number]) => {
                const [sprintId, offset, limit] = routeParams;
                return this.sprintService.getSprintStories(sprintId, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}
