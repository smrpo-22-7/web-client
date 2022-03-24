import { Component, OnDestroy, OnInit } from "@angular/core";
import { SprintService } from "@services";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { map, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { Sprint } from "@lib";

@Component({
    selector: "sc-sprint-details-page",
    templateUrl: "./sprint-details-page.component.html",
    styleUrls: ["./sprint-details-page.component.scss"]
})
export class SprintDetailsPageComponent implements OnInit, OnDestroy {
    
    public sprint$: Observable<Sprint>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private sprintService: SprintService,
                private route: ActivatedRoute) {
    }
    
    ngOnInit(): void {
        this.sprint$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("sprintId") as string;
            }),
            switchMap((sprintId: string) => {
                return this.sprintService.getSprint(sprintId);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}
