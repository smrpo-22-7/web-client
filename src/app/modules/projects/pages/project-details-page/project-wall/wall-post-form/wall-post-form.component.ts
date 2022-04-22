import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import { Observable, Subject, switchMap, take } from "rxjs";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import SimpleMDE from "simplemde";
import { ToastrService } from "ngx-toastr";
import { ProjectService, ProjectWallService } from "@services";
import { ProjectWallPost } from "@lib";

@Component({
    selector: "sc-wall-post-form",
    templateUrl: "./wall-post-form.component.html",
    styleUrls: ["./wall-post-form.component.scss"]
})
export class WallPostFormComponent implements OnInit, AfterViewInit, OnDestroy {
    
    @Input()
    public projectId$: Observable<string>;
    
    @Output()
    public whenPostCreate = new EventEmitter<void>();
    
    @Output()
    public whenCancel = new EventEmitter<void>();
    
    private destroy$ = new Subject<boolean>();
    
    public postForm: FormGroup;
    private editorRef: ElementRef<HTMLDivElement>;
    private editorInstance: SimpleMDE;
    
    constructor(private fb: FormBuilder,
                private projectService: ProjectService,
                private projectWallService: ProjectWallService,
                private toastrService: ToastrService) {
    }
    
    ngOnInit(): void {
        this.postForm = this.fb.group({
            markdownContent: this.fb.control(""),
        });
    }
    
    ngAfterViewInit() {
        this.editorInstance = new SimpleMDE({ element: this.editorRef.nativeElement });
        this.editorInstance.codemirror.on("change", () => {
            this.markdownContentCtrl.setValue(this.editorInstance.value(), { emitEvent: false });
        });
    }
    
    public savePost() {
        const post: Partial<ProjectWallPost> = {
            markdownContent: this.markdownContentCtrl.value,
        };
        this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.projectWallService.addProjectWallPost(projectId, post);
            }),
            take(1),
        ).subscribe({
            next: () => {
                this.toastrService.success("Post added!", "Success!");
                this.whenPostCreate.next();
            },
            error: () => {
                this.toastrService.error("Error adding post!", "Error!");
                this.whenPostCreate.next();
            }
        });
    }
    
    public reset(): void {
        this.whenCancel.next();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get markdownContentCtrl(): FormControl {
        return this.postForm.controls["markdownContent"] as FormControl;
    }
    
    @ViewChild("mdEditor", { static: false })
    public set editorReference(content: ElementRef<HTMLDivElement>) {
        if (content) {
            this.editorRef = content;
        }
    }
}
