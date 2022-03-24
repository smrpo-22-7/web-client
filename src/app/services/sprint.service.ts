import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_URL } from "@injectables";
import {
    Sprint,
    SprintListResponse,
    SprintRegisterRequest
} from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";


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
    
    public getSprint(sprintId: string): Observable<Sprint> {
        const url = `${this.apiUrl}/sprints/${sprintId}`;
        return this.http.get(url).pipe(
            mapToType<Sprint>(),
            catchHttpError(),
        );
    }
    
}
