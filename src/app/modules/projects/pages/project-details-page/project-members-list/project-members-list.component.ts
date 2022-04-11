import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { ProjectMember } from "@lib";
import { ProjectService } from "@services";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

@Component({
    selector: "sc-project-members-list",
    templateUrl: "./project-members-list.component.html",
    styleUrls: ["./project-members-list.component.scss"]
})
export class ProjectMembersListComponent implements OnInit, OnDestroy {
    
    @Input()
    public projectId$: Observable<string>;
    
    private destroy$ = new Subject<boolean>();
    public members$: Observable<EntityList<ProjectMember>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    
    constructor(private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.members$ = combineLatest([this.projectId$, this.offset$, this.limit$]).pipe(
            switchMap((routeParams: [string, number, number]) => {
                const [projectId, offset, limit] = routeParams;
                return this.projectService.getProjectMembers(projectId, { offset, limit }, "wrap");
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
