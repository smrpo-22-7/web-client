import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { filter, map, startWith, Subject, switchMap, take, takeUntil } from "rxjs";
import { DocsService } from "@services";
import { ProjectDocumentation } from "@lib";
import SimpleMDE from "simplemde";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "sc-project-docs-form-page",
    templateUrl: "./project-docs-form-page.component.html",
    styleUrls: ["./project-docs-form-page.component.scss"]
})
export class ProjectDocsFormPageComponent implements OnInit, AfterViewInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    
    public docsForm: FormGroup;
    public showUploadForm: boolean = false;
    public selectedFile: File | null;
    
    private editorRef: ElementRef<HTMLDivElement>;
    private editorInstance: SimpleMDE;
    
    constructor(private route: ActivatedRoute,
                private docsService: DocsService,
                private router: Router,
                private toastrService: ToastrService,
                private fb: FormBuilder) {
    }
    
    ngOnInit(): void {
        this.docsForm = this.fb.group({
            markdownContent: this.fb.control(""),
            projectId: this.fb.control(""),
        });
        this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
            switchMap((projectId: string) => {
                return this.docsService.getDocumentation(projectId);
            }),
            takeUntil(this.destroy$),
        ).subscribe({
            next: (documentation: ProjectDocumentation) => {
                this.docsForm.patchValue(documentation);
            },
        });
    }
    
    ngAfterViewInit() {
        this.editorInstance = new SimpleMDE({ element: this.editorRef.nativeElement });
        this.editorInstance.codemirror.on("change", () => {
            this.markdownContentCtrl.setValue(this.editorInstance.value(), {emitEvent: false});
        })
        this.markdownContentCtrl.valueChanges.pipe(
            filter(value => value && value.length > 0),
            takeUntil(this.destroy$),
        ).subscribe({
            next: value => {
                this.editorInstance.value(value);
            }
        })
    }
    
    public updateDocs(projectId: string) {
        const markdownContent = this.docsForm.get("markdownContent")?.value || "";
        this.docsService.updateDocumentation(projectId, markdownContent)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.toastrService.success("Documentation was updated!", "Success!");
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
                        this.toastrService.success("Documentation was uploaded!", "Success!");
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
    
    public reset(): void {
        this.router.navigate(["/projects", this.projectIdCtrlVal, "docs"]);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get markdownContentCtrl(): FormControl {
        return this.docsForm.controls["markdownContent"] as FormControl;
    }
    
    public get projectIdCtrlVal(): string {
        return this.docsForm.controls["projectId"].value;
    }
    
    @ViewChild("mdEditor", { static: false })
    public set editorReference(content: ElementRef<HTMLDivElement>) {
        if (content) {
            this.editorRef = content;
        }
    }
    
}
