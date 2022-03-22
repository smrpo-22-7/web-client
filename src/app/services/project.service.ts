import { Inject, Injectable } from "@angular/core";
import { ProjectRole } from "@lib";

import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import { ChangePasswordRequest, ConflictError, User, UsernameCheckRequest, UserProfile, UserRegisterRequest, ProjectRegisterRequest, NameCheckRequest } from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class ProjectService {


    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }

    public getProjectRoles(): Observable<ProjectRole[]> {
        return of([
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "product_owner", name: "Product owner" },
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "scrum_master", name: "Scrum master" },
            { id: "1", createdAt: new Date(), updatedAt: new Date(), roleId: "member", name: "Member" }
        ]);
    }

    public createProject(request: ProjectRegisterRequest): Observable<void> {
        const url = `${this.apiUrl}/projects`;
        return this.http.post(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    public checkProjectExists(name: string): Observable<boolean> {
        const url = `${this.apiUrl}/projects/name-check`;
        const payload: NameCheckRequest = {
            value: name,
        };
        return this.http.post(url, payload).pipe(
            map(() => false),
            catchHttpError(),
            catchError((err: BaseError) => {
                if (err instanceof ConflictError) {
                    return of(true);
                }
                return throwError(() => err);
            }),
        );
    }

}