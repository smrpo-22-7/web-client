import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorService } from "@services";
import { map, Observable, Subject, takeUntil } from "rxjs";
import { PageError } from "@lib";
import { routeParam } from "@utils";

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
        this.error$ = routeParam("status", this.route).pipe(
            map((status: string) => {
                return this.errorService.getError(status);
            }),
            takeUntil(this.destroy$),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
