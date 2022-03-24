import { Inject, Injectable } from "@angular/core";
import { ProjectRole, SprintListResponse } from "@lib";

import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import {
    ChangePasswordRequest,
    ConflictError,
    User,
    UsernameCheckRequest,
    UserProfile,
    UserRegisterRequest,
    ProjectRegisterRequest,
    NameCheckRequest,
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
    
}
