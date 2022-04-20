import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { CheckboxSelectEvent, ExtendedStory, NavState, NavStateStatus } from "@lib";
import { Subject, take } from "rxjs";
import { ProjectRole } from "@config/roles.config";
import { StoryService } from "@services";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "sc-story-list-header",
    templateUrl: "./story-list-header.component.html",
    styleUrls: ["./story-list-header.component.scss"]
})
export class StoryListHeaderComponent implements OnInit, OnDestroy {
    
    @Input()
    public story: ExtendedStory;
    
    @Input()
    public nav: NavState;
    
    @Input()
    public allowSelection: boolean = true;
    
    @Input()
    public showInSprintBadge: boolean = true;
    
    @Output()
    public whenSelected = new EventEmitter<CheckboxSelectEvent<ExtendedStory>>();
    
    private destroy$ = new Subject<boolean>();
    
    public projectRoles = ProjectRole;
    public navStates = NavStateStatus;
    
    constructor(private storyService: StoryService,
                private toastrService: ToastrService,) {
    }
    
    ngOnInit(): void {
    
    }
    
    public onStorySelect($event: Event) {
        $event.stopPropagation();
        
        const checkboxElement = $event.target as HTMLInputElement;
        this.whenSelected.emit({
            checked: checkboxElement.checked,
            item: this.story,
        });
    }
    
    public preventExpand($event: Event) {
        $event.stopPropagation();
    }
    
    public onEstimateUpdate(newValue: number, storyId: string): void {
        if (newValue && newValue > 0) {
            setTimeout(() => {
                this.storyService.updateStoryTimeEstimate(storyId, newValue).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastrService.success("Time estimate was updated!", "Success!");
                    },
                    error: err => {
                        console.error(err);
                        this.toastrService.error("Error updating time estimate!", "Error!");
                    }
                })
            }, 500);
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
