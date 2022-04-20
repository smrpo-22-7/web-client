import { Component, Input, OnInit } from "@angular/core";
import { ExtendedStory, NavState, NavStateStatus } from "@lib";
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
    public story: ExtendedStory;
    
    @Input()
    public nav: NavState;
    
    @Input()
    public allowTaskEdit: boolean = true;
    
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
            allowTaskEdit: this.allowTaskEdit,
        };
        this.modalService.openModal(StoryTasksDialogComponent, {
            initialState,
            class: "modal-xl tasks-dialog"
        });
    }
}
