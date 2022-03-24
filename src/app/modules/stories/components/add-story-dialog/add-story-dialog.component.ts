import { Component, OnDestroy, OnInit } from "@angular/core";
import { SprintService } from "@services";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { SprintListResponse } from "@lib";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "sc-add-story-dialog",
    templateUrl: "./add-story-dialog.component.html",
    styleUrls: ["./add-story-dialog.component.scss"]
})
export class AddStoryDialogComponent implements OnInit, OnDestroy {
    
    public sprints$: Observable<SprintListResponse>;
    private destroy$ = new Subject<boolean>();
    
    public projectId: string;
    public storyIds: string[];
    
    constructor(private sprintService: SprintService,
                private toastrService: ToastrService,
                private modalRef: BsModalRef) {
    }
    
    ngOnInit(): void {
        this.sprints$ = this.sprintService.getProjectSprints(this.projectId, false, false, true).pipe(
            takeUntil(this.destroy$),
        );
    }
    
    public onSprintSelect(sprintId: string) {
        this.sprintService.addStoriesToSprint(sprintId, this.storyIds).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.toastrService.success("Stories added to sprint!", "Success!");
            },
            error: err => {
                console.error(err);
            },
            complete: () => {
                this.modalRef.hide();
            }
        });
    }
    
    public close() {
        this.modalRef.hide();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}
