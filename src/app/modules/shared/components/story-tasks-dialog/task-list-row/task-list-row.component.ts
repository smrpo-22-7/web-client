import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import {
    catchError,
    debounceTime,
    filter,
    map,
    Observable, of,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap, throwError,
} from "rxjs";
import {
    AuthState,
    AuthStateStatus,
    ExtendedStory,
    FieldUpdateEvent,
    FieldValidators,
    Task,
    UserProfile,
    ValidationError
} from "@lib";
import { AuthService, ModalService, ProjectService, TaskService } from "@services";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BaseError } from "@mjamsek/prog-utils";
import { validateField } from "@utils";


@Component({
    selector: "sc-task-list-row",
    templateUrl: "./task-list-row.component.html",
    styleUrls: ["./task-list-row.component.scss"]
})
export class TaskListRowComponent implements OnInit, OnDestroy {
    
    @Input()
    public storyId: string;
    
    @Input()
    public story: ExtendedStory;
    
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
    private fieldsValidators: FieldValidators = {
        estimate: {
            type: "number",
            min: 0.5,
        },
        description: {
            type: "string",
            required: true,
        },
        completed: {
            type: "boolean",
        }
    }
    
    private _clickedInside = false;
    
    constructor(private authService: AuthService,
                private taskService: TaskService,
                private projectService: ProjectService,
                private modalService: ModalService,
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
                return value && value.length && value.length > 0 && value !== "[object Object]";
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
    
    public openDeleteDialog() {
        const message = `Are you sure you want to delete task?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.handleAction(this.taskService.deleteTask(this.task.id));
                ref.hide();
            }
        }, {
            confirm: {
                clazz: "btn-danger",
            },
            decline: {
                clazz: "btn-outline-primary",
            }
        });
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
        const result = validateField(field, newValue, this.fieldsValidators[field]);
        if (result === null) {
            if (newValue || typeof newValue === "boolean") {
                this.update$.next({
                    field,
                    item: newValue,
                    requestRefresh: false,
                });
            }
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
                    catchError((err: BaseError) => {
                        if (err instanceof ValidationError) {
                            return of(undefined);
                        }
                        return throwError(() => err);
                    }),
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
        this.assignUser(user.id);
    }
    
    public assignUser(userId: string) {
        this.update$.next({
            field: "assigneeId",
            item: userId,
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
        if (this.allowEdit) {
            Object.keys(this.edits).forEach((key) => {
                if (key === field) {
                    (this.edits as any)[key] = true;
                } else {
                    (this.edits as any)[key] = false;
                }
            });
        }
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
    
    public get allowEdit(): boolean {
        return !this.story.realized && this.story.inActiveSprint;
    }
}
