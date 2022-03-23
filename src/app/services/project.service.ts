import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError, EntityList } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import { ConflictError, ProjectRegisterRequest, NameCheckRequest, Project, ProjectRole, Story } from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class ProjectService {
    
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public getProjectRoles(): Observable<ProjectRole[]> {
        const url = `${this.apiUrl}/projects/roles`;
        return this.http.get(url).pipe(
            mapToType<ProjectRole[]>(),
            catchHttpError(),
        );
    }
    
    public getUserProjects(): Observable<EntityList<Project>> {
        const url = `${this.apiUrl}/projects/my-projects`;
        return this.http.get(url, { observe: "response" }).pipe(
            mapToType<HttpResponse<Project[]>>(),
            map((resp: HttpResponse<Project[]>) => {
                return EntityList.of(
                    resp.body!,
                    parseInt(resp.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
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
    
    public getProjectStories(projectId: string, offset: number = 0, limit: number = 10): Observable<EntityList<Story>> {
        const url = `${this.apiUrl}/projects/${projectId}/stories`;
        const params = {
            limit,
            offset,
            order: "numberId ASC"
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
        )
    }
    
}
