import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { StoryService } from "@services";
import { BsModalRef } from "ngx-bootstrap/modal";
import { take } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { VoidFunc } from "@mjamsek/prog-utils";
import { ExtendedStory } from "@lib";

@Component({
    selector: "sc-reject-story-dialog",
    templateUrl: "./reject-story-dialog.component.html",
    styleUrls: ["./reject-story-dialog.component.scss"]
})
export class RejectStoryDialogComponent implements OnInit {
    
    public story: ExtendedStory;
    public onReject: VoidFunc = () => {};
    
    public rejectForm: FormGroup;
    
    constructor(private fb: FormBuilder,
                private ref: BsModalRef,
                private toastrService: ToastrService,
                private storyService: StoryService) {
    }
    
    ngOnInit(): void {
        this.rejectForm = this.fb.group({
            rejectComment: this.fb.control(""),
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
    
    public get commentCtrl(): FormControl {
        return this.rejectForm.get("rejectComment") as FormControl;
    }
}
