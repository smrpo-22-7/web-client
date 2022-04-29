import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { filter, Observable, share, Subject, switchMap, take, takeUntil } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DocsService } from "@services";
import { mapToType, routeParam } from "@utils";

@Component({
    selector: "sc-project-docs-details-page",
    templateUrl: "./project-docs-details-page.component.html",
    styleUrls: ["./project-docs-details-page.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectDocsDetailsPageComponent implements OnInit, OnDestroy {
    
    public docs$: Observable<string>;
    private projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private docsService: DocsService) {
    }
    
    ngOnInit(): void {
        this.projectId$ = routeParam("projectId", this.route);
        this.docs$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.docsService.getDocumentationContent(projectId, true, true);
            }),
            filter((content: string | null) => {
                return content !== null;
            }),
            mapToType<string>(),
            share(),
            takeUntil(this.destroy$),
        );
    }
    
    public downloadDocumentation(): void {
        this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.docsService.downloadDocumentationFile(projectId);
            }),
            take(1),
        ).subscribe({
            next: () => {
            
            },
        });
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
