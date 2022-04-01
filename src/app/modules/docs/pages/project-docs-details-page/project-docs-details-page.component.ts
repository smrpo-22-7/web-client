import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { filter, map, Observable, startWith, Subject, switchMap, take, takeUntil } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DocsService } from "@services";
import { DomSanitizer } from "@angular/platform-browser";
import { mapToType } from "@utils";

@Component({
    selector: "sc-project-docs-details-page",
    templateUrl: "./project-docs-details-page.component.html",
    styleUrls: ["./project-docs-details-page.component.scss"]
})
export class ProjectDocsDetailsPageComponent implements OnInit, OnDestroy {
    
    public docs$: Observable<string>;
    private projectId$: Observable<string>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private docsService: DocsService,
                private domSanitizer: DomSanitizer) {
    }
    
    ngOnInit(): void {
        this.projectId$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            })
        );
        this.docs$ = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.docsService.getDocumentationContent(projectId, true, true);
            }),
            map((content: string) => {
                return this.domSanitizer.sanitize(SecurityContext.HTML, content);
            }),
            filter((content: string | null) => {
                return content !== null;
            }),
            mapToType<string>(),
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
