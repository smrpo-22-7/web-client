import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, of, Subject, takeUntil } from "rxjs";
import { FormBuilder, FormControl } from "@angular/forms";
import { NavState, NavStateStatus, ProjectMock } from "@lib";
import { NavContext } from "@context";

@Component({
    selector: "sc-project-picker",
    templateUrl: "./project-picker.component.html",
    styleUrls: ["./project-picker.component.scss"]
})
export class ProjectPickerComponent implements OnInit, OnDestroy {
    
    public projects$: Observable<ProjectMock[]>;
    private destroy$ = new Subject<boolean>();
    
    public projectCtrl: FormControl;
    
    constructor(private fb: FormBuilder,
                private nav: NavContext) {
    }
    
    ngOnInit(): void {
        this.projects$ = of([
            { name: "Projekt 1", id: "1" },
            { name: "Projekt 2", id: "2" },
            { name: "Projekt 3", id: "3" },
            { name: "Projekt 4", id: "4" },
            { name: "Projekt 5", id: "5" },
        ]);
    
        this.projectCtrl = this.fb.control(null);
    
        this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (state: NavState) => {
                if (state.status === NavStateStatus.IN_CONTEXT) {
                    this.projectCtrl.setValue(state.projectId, {emitEvent: false});
                }
            }
        });
    
        this.projectCtrl.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (projectId: string) => {
                this.nav.setContext(projectId);
            },
        });
    }
    
    ngOnDestroy(): void {
        this.destroy$.next(true);
    }
    
}
