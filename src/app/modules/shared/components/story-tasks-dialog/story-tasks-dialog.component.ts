import { Component, OnDestroy, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
    BehaviorSubject,
    filter,
    Observable,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil, tap,
} from "rxjs";
import { ProjectService, StoryService } from "@services";
import { ExtendedStory, ExtendedTask, Task, UserProfile } from "@lib";
import { initialName } from "@utils";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { VoidFunc } from "@mjamsek/prog-utils";


@Component({
    selector: "sc-story-tasks-dialog",
    templateUrl: "./story-tasks-dialog.component.html",
    styleUrls: ["./story-tasks-dialog.component.scss"]
})
export class StoryTasksDialogComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public storyId: string;
    public story: ExtendedStory;
    public projectId: string;
    public storyNumberId: number;
    public allowTaskEdit: boolean;
    public hasActiveTask: boolean = false;
    public onUpdate: VoidFunc;
    
    public tasks$: Observable<ExtendedTask[]>;
    public members$: Observable<UserProfile[]>;
    public refresh$ = new BehaviorSubject<void>(undefined);
    private destroy$ = new Subject<boolean>();
    
    public taskForm: FormGroup;
    
    constructor(private modalRef: BsModalRef,
                private storyService: StoryService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private toastrService: ToastrService,
                private fb: FormBuilder) {
        super();
    }
    
    ngOnInit(): void {
        this.tasks$ = this.refresh$.pipe(
            switchMap(() => {
                return this.storyService.getStoryTasks(this.storyId)
            }),
            tap((tasks: ExtendedTask[]) => {
                this.hasActiveTask = tasks.some(task => task.active);
            }),
            takeUntil(this.destroy$),
        );
        this.taskForm = this.fb.group({
            userQuery: this.fb.control(""),
            description: this.fb.control("", [Validators.required]),
            estimate: this.fb.control(1, [Validators.min(0.5)]),
            assignment: this.fb.group({
                assigneeId: this.fb.control(null),
                assigneeName: this.fb.control(null),
                assigneeInitials: this.fb.control(null),
            }),
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
    
    public onUserSelect($event: UserProfile): void {
        this.userQueryCtrl.reset("");
        this.taskForm.get("assignment.assigneeId")?.setValue($event.id);
        this.taskForm.get("assignment.assigneeName")?.setValue($event.lastName + " " + $event.firstName);
        this.taskForm.get("assignment.assigneeInitials")?.setValue(initialName($event.lastName + " " + $event.firstName));
    }
    
    public clearAssignee() {
        this.userQueryCtrl.reset("");
        this.taskForm.get("assignment.assigneeId")?.reset(null);
        this.taskForm.get("assignment.assigneeName")?.reset(null);
        this.taskForm.get("assignment.assigneeInitials")?.reset(null);
    }
    
    public close() {
        this.modalRef.hide();
    }
    
    public addTask() {
        const payload = this.taskForm.getRawValue();
        const task = {
            description: payload["description"],
            estimate: payload["estimate"],
            assignment: {
                assigneeId: payload["assignment"]["assigneeId"],
            },
        };
        
        // @ts-ignore
        this.storyService.createTask(this.storyId, task).pipe(
            take(1)
        ).subscribe({
            next: () => {
                this.refresh$.next();
                this.taskForm.reset();
                this.onUpdate();
            }
        });
    }
    
    public refreshData() {
        this.refresh$.next();
        this.onUpdate();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get userQueryCtrl(): FormControl {
        return this.taskForm.get("userQuery") as FormControl;
    }
    
    public get assigneeInitialsCtrl(): FormControl {
        return this.taskForm.get("assignment.assigneeInitials") as FormControl;
    }
    
    public get assigneeNameCtrl(): FormControl {
        return this.taskForm.get("assignment.assigneeName") as FormControl;
    }
    
    public getTaskId(index: number, task: ExtendedTask): string {
        return task.id;
    }
}
