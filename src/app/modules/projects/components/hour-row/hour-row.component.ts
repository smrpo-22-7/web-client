import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FieldUpdateEvent, FieldValidators, TaskWorkSpent, ValidationError } from "@lib";
import { validateField } from "@utils";
import { TaskService } from "@services";
import { catchError, debounceTime, map, of, Subject, switchMap, takeUntil, tap, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { BaseError } from "@mjamsek/prog-utils";

@Component({
    selector: "sc-hour-row",
    templateUrl: "./hour-row.component.html",
    styleUrls: ["./hour-row.component.scss"],
})
export class HourRowComponent implements OnInit, OnDestroy {
    
    @Input()
    public taskHour: TaskWorkSpent;
    
    @Output()
    public whenUpdated = new EventEmitter<void>();
    
    private update$ = new Subject<FieldUpdateEvent<number>>();
    private destroy$ = new Subject<boolean>();
    
    public edits = {
        amount: false,
        remainingAmount: false,
    };
    private _clickedInside = false;
    private validators: FieldValidators = {
        amount: {
            type: "number",
            min: 0,
            subtype: "float",
            required: true,
        },
        remainingAmount: {
            type: "number",
            min: 0,
            subtype: "float",
            required: true,
        }
    }
    
    constructor(private taskService: TaskService,
                private toastrService: ToastrService) {
    }
    
    ngOnInit(): void {
        this.registerUpdateHandler();
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
    
    public toggleEditRow(field: string) {
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
    
    public markClicked() {
        this._clickedInside = true;
    }
    
    private registerUpdateHandler() {
        this.update$.pipe(
            debounceTime(500),
            switchMap(($event: FieldUpdateEvent<number>) => {
                let payload = {
                    [$event.field]: $event.item,
                };
                return this.taskService.updateTaskHours(this.taskHour.id, payload).pipe(
                    catchError((err: BaseError) => {
                        if (err instanceof ValidationError) {
                            return of(undefined);
                        }
                        return throwError(() => err);
                    }),
                    map(() => {
                        return $event.requestRefresh ?? true;
                    }),
                    tap((refresh: boolean) => {
                        if (refresh) {
                            this.whenUpdated.next();
                        }
                    }),
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }
    
    public onAmountUpdate(newValue: number, field: string): void {
        const errors = validateField(field, newValue, this.validators[field]);
        if (errors === null) {
            this.update$.next({
                field,
                item: newValue,
                requestRefresh: true,
            });
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get allowEdit(): boolean {
        return !this.taskHour.task.completed;
    }
}
