import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FieldType, FieldUpdateEvent, TaskWorkSpent, ValidationError } from "@lib";
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
    
    public editRow: boolean = false;
    private _clickedInside = false;
    private amountValidator: FieldType = {
        type: "number",
        min: 0,
        subtype: "float",
        required: true,
    };
    
    constructor(private taskService: TaskService,
                private toastrService: ToastrService) {
    }
    
    ngOnInit(): void {
        this.registerUpdateHandler();
    }
    
    @HostListener("document:click", ["$event"])
    public onDocumentClick($event: Event) {
        if (!this._clickedInside) {
            if (this.taskHour.amount && this.taskHour.amount >= 0) {
                this.editRow = false;
            }
        }
        this._clickedInside = false;
    }
    
    public toggleEditRow() {
        this._clickedInside = true;
        this.editRow = true;
    }
    
    public markClicked() {
        this._clickedInside = true;
    }
    
    private registerUpdateHandler() {
        this.update$.pipe(
            debounceTime(500),
            switchMap(($event: FieldUpdateEvent<number>) => {
                return this.taskService.updateTaskHours($event.item, this.taskHour.id).pipe(
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
                        this.editRow = false;
                    }),
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }
    
    public onAmountUpdate(newValue: number): void {
        const errors = validateField("", newValue, this.amountValidator);
        if (errors === null) {
            this.update$.next({
                field: "amount",
                item: newValue,
                requestRefresh: true,
            });
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
