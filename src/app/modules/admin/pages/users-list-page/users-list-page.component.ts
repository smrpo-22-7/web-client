import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "sc-users-list-page",
    templateUrl: "./users-list-page.component.html",
    styleUrls: ["./users-list-page.component.scss"]
})
export class UsersListPageComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}
