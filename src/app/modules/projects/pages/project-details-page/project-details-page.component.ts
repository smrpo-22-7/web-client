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
    public projectId$: Observable<string>;
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
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
