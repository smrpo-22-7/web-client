import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { Project, ProjectMember } from "@lib";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

@Component({
    selector: "sc-project-details-page",
    templateUrl: "./project-details-page.component.html",
    styleUrls: ["./project-details-page.component.scss"]
})
export class ProjectDetailsPageComponent implements OnInit, OnDestroy {
    
    public project$: Observable<Project>;
    public members$: Observable<EntityList<ProjectMember>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    private projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
        );
        
        this.project$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.projectService.getProject(projectId);
            }),
            takeUntil(this.destroy$)
        );
        this.members$ = combineLatest([this.projectId$, this.offset$, this.limit$]).pipe(
            switchMap((routeParams: [string, number, number]) => {
                const [projectId, offset, limit] = routeParams;
                return this.projectService.getProjectMembers(projectId, offset, limit);
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
