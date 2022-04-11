import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { debounceTime, Observable, Subject, take, takeUntil } from "rxjs";
import { AuthState, AuthStateStatus, Task } from "@lib";
import { AuthService, StoryService, TaskService } from "@services";

@Component({
    selector: "sc-task-list-row",
    templateUrl: "./task-list-row.component.html",
    styleUrls: ["./task-list-row.component.scss"]
})
export class TaskListRowComponent implements OnInit, OnDestroy {
    
    @Input()
    public storyId: string;
    
    @Input()
    public task: Task;
    
    @Output()
    public whenUpdated = new EventEmitter<void>();
    
    public authStates = AuthStateStatus;
    
    public auth$: Observable<AuthState>;
    private destroy$ = new Subject<boolean>();
    public edits = {
        description: false,
        estimate: false,
        assignee: false,
    };
    
    private _clickedInside = false;
    
    constructor(private authService: AuthService,
                private taskService: TaskService,
                private storyService: StoryService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    public acceptTask() {
        this.taskService.acceptTaskRequest(this.task.id).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.whenUpdated.emit();
            }
        });
    }
    
    public declineTask() {
        this.taskService.declineTaskRequest(this.task.id).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.whenUpdated.emit();
            }
        });
    }
    
    public updateTask(newValue: string, field: string) {
        if (!newValue) {
            return;
        }
        const payload = {
            [field]: field === "estimate" ? parseInt(newValue, 10) : newValue,
        };
        this.taskService.updateTask(this.task.id, payload).pipe(
            debounceTime(250),
            take(1)
        ).subscribe({
            next: () => {
                this.whenUpdated.emit();
            },
        });
    }
    
    @HostListener("document:click", ["$event"])
    public onDocumentClick($event: Event) {
        if (!this._clickedInside) {
            Object.keys(this.edits).forEach((key) => {
                (this.edits as any)[key] = false;
            });
        }
        this._clickedInside = false;
    }
    
    public toggleEdits(field: string) {
        this._clickedInside = true;
        Object.keys(this.edits).forEach((key) => {
            if (key === field) {
                (this.edits as any)[key] = true;
            } else {
                (this.edits as any)[key] = false;
            }
        });
    }
    
    public markClicked() {
        this._clickedInside = true;
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
