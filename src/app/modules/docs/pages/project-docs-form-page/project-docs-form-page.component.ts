import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { DocsService } from "@services";
import { map, Observable, startWith, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { ProjectDocumentation } from "@lib";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "sc-project-docs-form-page",
    templateUrl: "./project-docs-form-page.component.html",
    styleUrls: ["./project-docs-form-page.component.scss"]
})
export class ProjectDocsFormPageComponent implements OnInit, OnDestroy {
    
    public docs$: Observable<ProjectDocumentation>;
    private destroy$ = new Subject<boolean>();
    
    public docsForm: FormGroup;
    public showUploadForm: boolean = false;
    public selectedFile: File | null;
    
    constructor(private route: ActivatedRoute,
                private docsService: DocsService,
                private router: Router,
                private fb: FormBuilder) {
    }
    
    ngOnInit(): void {
        this.docs$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
            switchMap((projectId: string) => {
                return this.docsService.getDocumentation(projectId);
            }),
            tap((documentation: ProjectDocumentation) => {
                this.docsForm.patchValue(documentation, { emitEvent: false });
            }),
            takeUntil(this.destroy$),
        );
        this.docsForm = this.fb.group({
            markdownContent: this.fb.control("")
        });
    }
    
    public updateDocs(projectId: string) {
        const markdownContent = this.docsForm.get("markdownContent")?.value || "";
        this.docsService.updateDocumentation(projectId, markdownContent)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.router.navigate(["/projects", projectId, "docs"]);
                },
                error: err => {
                    console.error(err);
                },
            });
    }
    
    public showUploadButton() {
        return this.showUploadForm = true;
    }
    
    public uploadFile(files: FileList) {
        if (files.length > 0) {
            this.selectedFile = files.item(0);
        }
    }
    
    public submitFile(projectId: string) {
        if (this.selectedFile !== null) {
            this.docsService.uploadDocumentationFile(projectId, this.selectedFile)
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.router.navigate(["/projects", projectId, "docs"]);
                    },
                    error: err => {
                        console.error(err);
                    },
                });
        } else {
            throw new TypeError("File is not selected!");
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
