import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";

import { API_URL } from "@injectables";
import {
    ConflictError,
    Sprint, SprintConflictCheckRequest,
    SprintListResponse,
    SprintRegisterRequest, Story
} from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import { BaseError, EntityList } from "@mjamsek/prog-utils";


@Injectable({
    providedIn: "root"
})

export class SprintService {
    
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public createSprint(request: SprintRegisterRequest, projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/sprints`;
        return this.http.post(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getProjectSprints(projectId: string, active: boolean, past: boolean, future: boolean): Observable<SprintListResponse> {
        const url = `${this.apiUrl}/projects/${projectId}/sprints`;
        const params = {
            active,
            past,
            future,
        };
        return this.http.get(url, { params }).pipe(
            mapToType<SprintListResponse>(),
            catchHttpError(),
        );
    }
    
    public addStoriesToSprint(sprintId: string, storyIds: string[]): Observable<void> {
        const url = `${this.apiUrl}/sprints/${sprintId}/stories`;
        return this.http.post(url, { storyIds }).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getSprintStories(sprintId: string, offset: number = 0, limit: number = 10): Observable<EntityList<Story>> {
        const url = `${this.apiUrl}/sprints/${sprintId}/stories`;
        const params = {
            offset,
            limit,
        };
        return this.http.get(url, { params, observe: "response" }).pipe(
            mapToType<HttpResponse<Story[]>>(),
            map((res: HttpResponse<Story[]>) => {
                return EntityList.of(
                    res.body!,
                    parseInt(res.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
    }
    
    public getSprint(sprintId: string): Observable<Sprint> {
        const url = `${this.apiUrl}/sprints/${sprintId}`;
        return this.http.get(url).pipe(
            mapToType<Sprint>(),
            catchHttpError(),
        );
    }
    
    public checkForConflicts(projectId: string, request: SprintConflictCheckRequest): Observable<boolean> {
        const url = `${this.apiUrl}/projects/${projectId}/sprints/check`;
        return this.http.post(url, request, { observe: "response" }).pipe(
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
