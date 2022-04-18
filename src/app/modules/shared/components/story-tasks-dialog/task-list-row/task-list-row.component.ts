import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import {
    debounceTime,
    filter,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap,
} from "rxjs";
import { AuthState, AuthStateStatus, FieldUpdateEvent, Task, UserProfile } from "@lib";
import { AuthService, ProjectService, TaskService } from "@services";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";


@Component({
    selector: "sc-task-list-row",
    templateUrl: "./task-list-row.component.html",
    styleUrls: ["./task-list-row.component.scss"]
})
export class TaskListRowComponent implements OnInit, OnDestroy {
    
    @Input()
    public storyId: string;
    
    @Input()
    public projectId: string;
    
    @Input()
    public task: Task;
    
    @Output()
    public whenUpdated = new EventEmitter<void>();
    
    public authStates = AuthStateStatus;
    
    public auth$: Observable<AuthState>;
    public members$: Observable<UserProfile[]>;
    private update$ = new Subject<FieldUpdateEvent<string>>();
    private destroy$ = new Subject<boolean>();
    public edits = {
        description: false,
        estimate: false,
        assignee: false,
    };
    public userQueryForm: FormGroup;
    
    private _clickedInside = false;
    
    constructor(private authService: AuthService,
                private taskService: TaskService,
                private projectService: ProjectService,
                private fb: FormBuilder) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
            takeUntil(this.destroy$),
        );
        this.registerUpdateHandler();
        
        this.userQueryForm = this.fb.group({
            input: this.fb.control(""),
        });
        this.members$ = this.userQueryCtrl.valueChanges.pipe(
            startWith(""),
            filter(value => {
                return value && value.length && value.length > 0;
            }),
            switchMap((query: string) => {
                return this.projectService.queryProjectMembers(this.projectId, query);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public acceptTask() {
        this.handleAction(this.taskService.acceptTaskRequest(this.task.id));
    }
    
    public declineTask() {
        this.handleAction(this.taskService.declineTaskRequest(this.task.id));
    }
    
    public clearAssignee() {
        this.handleAction(this.taskService.clearAssignee(this.task.id));
    }
    
    private handleAction(action: Observable<void>) {
        action.pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.whenUpdated.emit();
            }
        });
    }
    
    public updateTask(newValue: any, field: string) {
        if (newValue || typeof newValue === "boolean") {
            this.update$.next({
                field,
                item: newValue,
                requestRefresh: field !== "completed"
            });
        }
    }
    
    private registerUpdateHandler() {
        this.update$.pipe(
            debounceTime(250),
            switchMap(($event: FieldUpdateEvent<string>) => {
                let payload = {
                    [$event.field]: this.parsePrimitive($event.item),
                };
                if ($event.field === "assigneeId") {
                    payload = {
                        assignment: {
                            assigneeId: $event.item,
                        }
                    };
                }
                return this.taskService.updateTask(this.task.id, payload).pipe(
                    map(() => {
                        return $event.requestRefresh ?? true;
                    }),
                );
            }),
            tap((refresh: boolean) => {
                if (refresh) {
                    this.whenUpdated.next();
                }
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }
    
    public onUserSelect(user: UserProfile) {
        this.update$.next({
            field: "assigneeId",
            item: user.id,
        });
        this.userQueryForm.reset();
        this.edits.assignee = false;
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
    
    public toggleDescriptionEdit(task: Task) {
        this._clickedInside = true;
        if (!task.description) {
            Object.keys(this.edits).forEach((key) => {
                if (key === "description") {
                    (this.edits as any)[key] = true;
                } else {
                    (this.edits as any)[key] = false;
                }
            });
        }
    }
    
    public markClicked() {
        this._clickedInside = true;
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    private parsePrimitive(value: string) {
        try {
            return JSON.parse(value);
        } catch (ignored) {
            return value;
        }
    }
    
    public get userQueryCtrl(): FormControl {
        return this.userQueryForm.get("input") as FormControl;
    }
}
