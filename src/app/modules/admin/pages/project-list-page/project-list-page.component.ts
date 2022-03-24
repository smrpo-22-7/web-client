import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { Project, SimpleStatus } from "@lib";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ProjectService } from "@services";

@Component({
    selector: "sc-project-list-page",
    templateUrl: "./project-list-page.component.html",
    styleUrls: ["./project-list-page.component.scss"]
})
export class ProjectListPageComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public projects$: Observable<EntityList<Project>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public filter$ = new BehaviorSubject<SimpleStatus>(SimpleStatus.ACTIVE);
    
    public statuses = SimpleStatus;
    
    constructor(private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.projects$ = combineLatest([this.filter$, this.offset$, this.limit$]).pipe(
            switchMap((params: [SimpleStatus, number, number]) => {
                const [status, offset, limit] = params;
                return this.projectService.getProjects(status, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public applyFilter(status: SimpleStatus): void {
        this.filter$.next(status);
        this.offset$.next(0);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}
