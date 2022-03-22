import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PriorityType } from "@lib";


@Injectable({
    providedIn: "root"
})
export class StorypriorityService {


    constructor() {
    }

    public getPriorities(): Observable<PriorityType[]> {
        return of([
            { id: "1", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "1", priorityname: "Must have" },
            { id: "2", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "2", priorityname: "Could have" },
            { id: "3", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "3", priorityname: "Should have" },
            { id: "4", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "4", priorityname: "Won't have this time" }
        ]);
    }

}