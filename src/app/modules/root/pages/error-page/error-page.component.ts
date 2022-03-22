import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ErrorService } from "@services";
import { filter, map, Observable, startWith, Subject, takeUntil } from "rxjs";
import { PageError } from "@lib";

@Component({
    selector: "sc-error-page",
    templateUrl: "./error-page.component.html",
    styleUrls: ["./error-page.component.scss"]
})
export class ErrorPageComponent implements OnInit, OnDestroy {
    
    public error$: Observable<PageError>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private route: ActivatedRoute,
                private errorService: ErrorService) {
    }
    
    ngOnInit(): void {
        this.error$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            filter((params: ParamMap) => {
                return params.has("status");
            }),
            map((params: ParamMap) => {
                return this.errorService.getError(params.get("status")!);
            }),
            takeUntil(this.destroy$),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
