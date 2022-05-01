import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StoryService } from "@services";
import { BsModalRef } from "ngx-bootstrap/modal";
import { take } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { VoidFunc } from "@mjamsek/prog-utils";
import { ExtendedStory } from "@lib";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import SimpleMDE from "simplemde";

@Component({
    selector: "sc-reject-story-dialog",
    templateUrl: "./reject-story-dialog.component.html",
    styleUrls: ["./reject-story-dialog.component.scss"]
})
export class RejectStoryDialogComponent extends FormBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    
    public story: ExtendedStory;
    public onReject: VoidFunc = () => {};
    
    public rejectForm: FormGroup;
    private editorRef: ElementRef<HTMLDivElement>;
    private editorInstance: SimpleMDE;
    
    constructor(private fb: FormBuilder,
                private ref: BsModalRef,
                private toastrService: ToastrService,
                private storyService: StoryService) {
        super();
    }
    
    ngOnInit(): void {
        this.rejectForm = this.fb.group({
            rejectComment: this.fb.control("", [Validators.required]),
        });
    }
    
    ngAfterViewInit() {
        this.editorInstance = new SimpleMDE({ element: this.editorRef.nativeElement });
        this.editorInstance.codemirror.on("change", () => {
            this.commentCtrl.setValue(this.editorInstance.value(), { emitEvent: false });
        });
    }
    
    public closeDialog() {
        this.ref.hide();
    }
    
    public rejectStory() {
        this.storyService.updateStoryStatus(this.story.id, {
            storyStatus: "REJECTED",
            rejectComment: this.commentCtrl.value,
        }).pipe(take(1)).subscribe({
            next: () => {
                this.ref.hide();
                this.onReject();
            },
            error: err => {
                console.error(err);
            },
            complete: () => {
                this.ref.hide();
            }
        });
    }
    
    ngOnDestroy() {
    }
    
    public get commentCtrl(): FormControl {
        return this.rejectForm.get("rejectComment") as FormControl;
    }
    
    @ViewChild("mdEditor", { static: false })
    public set editorReference(content: ElementRef<HTMLDivElement>) {
        if (content) {
            this.editorRef = content;
        }
    }
}
