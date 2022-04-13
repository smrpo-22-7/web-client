import { Component, Input, OnInit } from "@angular/core";
import { NavState, NavStateStatus, Story } from "@lib";
import { ModalService } from "@services";
import { StoryTasksDialogComponent } from "../story-tasks-dialog/story-tasks-dialog.component";
import { ProjectRole } from "@config/roles.config";

@Component({
    selector: "sc-story-list-content",
    templateUrl: "./story-list-content.component.html",
    styleUrls: ["./story-list-content.component.scss"]
})
export class StoryListContentComponent implements OnInit {
    
    @Input()
    public story: Story;
    
    @Input()
    public nav: NavState;
    
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    constructor(private modalService: ModalService) {
    }
    
    ngOnInit(): void {
    }
    
    public openTasksDialog() {
        const initialState = {
            storyId: this.story.id,
            projectId: this.story.projectId,
            storyNumberId: this.story.numberId,
        };
        this.modalService.openModal(StoryTasksDialogComponent, {
            initialState,
            class: "modal-xl tasks-dialog"
        });
    }
}