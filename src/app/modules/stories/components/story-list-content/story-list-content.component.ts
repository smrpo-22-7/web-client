import { Component, Input, OnInit } from "@angular/core";
import { Story } from "@lib";
import { ModalService } from "@services";
import { StoryTasksDialogComponent } from "../story-tasks-dialog/story-tasks-dialog.component";

@Component({
    selector: "sc-story-list-content",
    templateUrl: "./story-list-content.component.html",
    styleUrls: ["./story-list-content.component.scss"]
})
export class StoryListContentComponent implements OnInit {
    
    @Input()
    public story: Story;
    
    constructor(private modalService: ModalService) {
    }
    
    ngOnInit(): void {
    }
    
    public openTasksDialog() {
        const initialState = {
            storyId: this.story.id,
            projectId: this.story.projectId,
        };
        this.modalService.openModal(StoryTasksDialogComponent, {
            initialState,
            class: "modal-xl tasks-dialog"
        });
    }
}
