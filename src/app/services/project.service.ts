import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ProjectRole } from "@lib";


@Injectable({
    providedIn: "root"
})
export class ProjectService {


    constructor() {
    }

    public getProjectRoles(): Observable<ProjectRole[]> {
        return of([
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "product_owner", name: "Product owner" },
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "scrum_master", name: "Scrum master" },
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "member", name: "Member" }
        ]);
    }

}