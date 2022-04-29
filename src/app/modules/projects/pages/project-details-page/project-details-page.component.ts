import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, switchMap, takeUntil } from "rxjs";
import { Project } from "@lib";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "@services";
import { routeParam } from "@utils";

@Component({
    selector: "sc-project-details-page",
    templateUrl: "./project-details-page.component.html",
    styleUrls: ["./project-details-page.component.scss"]
})
export class ProjectDetailsPageComponent implements OnInit, OnDestroy {
    
    public project$: Observable<Project>;
    public projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.projectId$ = routeParam<string>("projectId", this.route);
        this.project$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.projectService.getProject(projectId);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
