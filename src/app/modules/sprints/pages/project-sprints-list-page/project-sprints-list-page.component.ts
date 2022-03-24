import { Component, OnDestroy, OnInit } from "@angular/core";
import { SprintService } from "@services";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { map, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { NavState, NavStateStatus, SprintListResponse } from "@lib";
import { ProjectRole } from "@config/roles.config";
import { NavContext } from "@context";

@Component({
    selector: "sc-project-sprints-list-page",
    templateUrl: "./project-sprints-list-page.component.html",
    styleUrls: ["./project-sprints-list-page.component.scss"]
})
export class ProjectSprintsListPageComponent implements OnInit, OnDestroy {
    
    public sprints$: Observable<SprintListResponse>;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();
    
    public navStates = NavStateStatus;
    public projectRoles = ProjectRole;
    
    constructor(private sprintService: SprintService,
                private nav: NavContext,
                private route: ActivatedRoute) {
    }
    
    ngOnInit(): void {
        this.sprints$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
            switchMap((projectId: string) => {
                return this.sprintService.getProjectSprints(projectId, true, true, true);
            }),
            takeUntil(this.destroy$),
        );
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
        
    }
}
