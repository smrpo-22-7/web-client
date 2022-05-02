import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap,
    throwError
} from "rxjs";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ExtendedTask, FieldUpdateEvent, FieldValidators, TaskWorkSpent, ValidationError } from "@lib";
import { TaskService } from "@services";
import { DatePipe } from "@angular/common";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { diffInDays, validateField } from "@utils";
import { BaseError } from "@mjamsek/prog-utils";

type HourValue = {
    date: Date;
    value: number;
}

@Component({
    selector: "sc-task-hours-dialog",
    templateUrl: "./task-hours-dialog.component.html",
    styleUrls: ["./task-hours-dialog.component.scss"]
})
export class TaskHoursDialogComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    public task: ExtendedTask;
    public projectId: string;
    public onUpdate = () => {
    };
    
    public hoursSum = {
        amount: 0,
        amountRemaining: 0,
    };
    public hoursForm: FormGroup;
    public hours$: Observable<Map<string, TaskWorkSpent>>;
    public refresh$ = new BehaviorSubject<void>(undefined);
    private destroy$ = new Subject<boolean>();
    private update$ = new Subject<FieldUpdateEvent<HourValue>>();
    private fieldsValidators: FieldValidators = {
        amount: {
            type: "number",
            min: 0,
            subtype: "float",
        },
        remainingAmount: {
            type: "number",
            min: 0,
            subtype: "float",
        },
    }
    
    constructor(private ref: BsModalRef,
                private fb: FormBuilder,
                private taskService: TaskService,
                private datePipe: DatePipe) {
        super();
    }
    
    ngOnInit(): void {
        this.hoursForm = this.fb.group({
            items: this.fb.array([]),
        });
        
        this.hours$ = this.refresh$.pipe(
            switchMap(() => {
                return this.taskService.getTaskHours(this.task.id);
            }),
            tap((tasks: TaskWorkSpent[]) => {
                const [amount, amountRemaining] = tasks.reduce((acc, task) => {
                    const [amounts, remainingAmounts] = acc;
                    return [amounts + task.amount, remainingAmounts + task.remainingAmount];
                }, [0, 0]);
                this.hoursSum = {
                    amount,
                    amountRemaining,
                };
            }),
            map((tasks: TaskWorkSpent[]) => {
                return tasks.reduce((acc: Map<string, TaskWorkSpent>, taskWork: TaskWorkSpent) => {
                    acc.set(this.datePipe.transform(taskWork.workDate, "dd.MM.yyyy")!, taskWork);
                    return acc;
                }, new Map<string, TaskWorkSpent>());
            }),
            tap((hoursMap: Map<string, TaskWorkSpent>) => {
                this.createHoursForm(hoursMap);
            }),
            takeUntil(this.destroy$),
        );
        
        this.update$.pipe(
            debounceTime(250),
            switchMap(($event: FieldUpdateEvent<HourValue>) => {
                const payload = {
                    [$event.field]: $event.item.value,
                    workDate: $event.item.date,
                };
                return this.taskService.updateTaskHoursByDate(this.task.id, payload).pipe(
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
                    this.onUpdate();
                    this.refresh$.next();
                }
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }
    
    public updateHours(hourId: string, newValue: any, field: string, fieldDate: Date) {
        const result = validateField(field, newValue, this.fieldsValidators[field]);
        if (result === null) {
            this.update$.next({
                field,
                item: {
                    date: fieldDate,
                    value: newValue,
                },
                requestRefresh: true,
            });
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    private createHoursForm(hoursMap: Map<string, TaskWorkSpent>) {
        const startDate = new Date(this.task.createdAt);
        const now = new Date();
        const days = diffInDays(startDate, now) + 1;
        const daysArray = Array.from(Array(days).keys()).map((_, index) => {
            const dateValue = new Date(startDate);
            dateValue.setDate(dateValue.getDate() + index);
            return dateValue;
        });
        
        this.itemsCtrl.clear();
        daysArray.forEach(dateValue => {
            const dateKey = this.datePipe.transform(dateValue, "dd.MM.yyyy")!;
            const taskHours = hoursMap.get(dateKey);
            this.itemsCtrl.push(this.fb.group({
                hoursDate: this.fb.control(dateValue),
                hours: this.fb.control(taskHours?.amount ?? 0),
                hoursRemaining: this.fb.control(taskHours?.remainingAmount ?? 0),
            }))
        });
    }
    
    public close() {
        this.ref.hide();
    }
    
    public get itemsCtrl(): FormArray {
        return this.hoursForm.get("items") as FormArray;
    }
    
}
