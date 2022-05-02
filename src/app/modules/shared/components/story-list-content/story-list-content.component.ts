import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ExtendedStory, NavState, NavStateStatus, Story, User } from "@lib";
import { ModalService, StoryService, UserService } from "@services";
import { StoryTasksDialogComponent } from "../story-tasks-dialog/story-tasks-dialog.component";
import { ProjectRole } from "@config/roles.config";
import { BehaviorSubject, take } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { getValueSymbolOfDeclaration } from "@angular/core/schematics/utils/typescript/symbol";
import { RejectStoryDialogComponent } from "@shared/components/reject-story-dialog/reject-story-dialog.component";
import { StoryPriorityLabel } from "@config/enums.config";

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
    
    @Output()
    public whenUpdated = new EventEmitter<void>();
    
    public storyPriorityLabels = StoryPriorityLabel;
    public storyPriorities = Story.Priority;
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    
    constructor(private modalService: ModalService,
                private storyService: StoryService,
                private toastrService: ToastrService) {
    }
    
    ngOnInit(): void {
    }
    
    public openTasksDialog() {
        const initialState = {
            storyId: this.story.id,
            story: this.story,
            projectId: this.story.projectId,
            storyNumberId: this.story.numberId,
            allowTaskEdit: this.allowTaskEdit,
            onUpdate: () => {
                this.whenUpdated.emit();
            },
        };
        this.modalService.openModal(StoryTasksDialogComponent, {
            initialState,
            class: "modal-xl tasks-dialog"
        });
    }
    
    public openDeletePrompt(story: Story) {
        const message = `Are you sure you want to remove story '${story.title}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.storyService.removeStory(story.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.whenUpdated.emit();
                        this.toastrService.success("Story removed!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("Error removing story!", "Error!");
                    },
                    complete: () => {
                        ref.hide();
                    },
                });
            }
        }, {
            confirm: {
                clazz: "btn-danger",
            },
            decline: {
                clazz: "btn-outline-secondary",
            }
        });
    }
    
    public realizeStory(story: Story) {
        const message = `Are you sure you want to approve story '${story.title}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.storyService.updateStoryStatus(story.id, { storyStatus: "REALIZED" }).pipe(take(1)).subscribe({
                    next: () => {
                        this.whenUpdated.emit();
                        this.toastrService.success("Story realized!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("Error realizing story!", "Error!");
                    },
                    complete: () => {
                        ref.hide();
                    },
                });
            }
        }, {
            confirm: {
                clazz: "btn-primary",
            },
            decline: {
                clazz: "btn-outline-danger",
            }
        });
        
    }
    
    public rejectStory(story: ExtendedStory) {
        this.modalService.openModal(RejectStoryDialogComponent, {
            initialState: {
                story,
                onReject: () => {
                    this.whenUpdated.emit();
                },
            },
            class: "modal-lg",
        });
    }
    
}
