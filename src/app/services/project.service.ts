import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError, EntityList } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import {
    ConflictError,
    ProjectRequest,
    NameCheckRequest,
    Project,
    ProjectRole,
    Story,
    ProjectMember,
    StoriesFilter,
    SimpleStatus,
    ProjectWallPost,
    KeeQuery,
    WrapOption,
    UserProfile,
    ProjectRolesCount,
    SprintStatus, ExtendedStory, ProjectStoriesParams
} from "@lib";
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
    
    public getProjects(status: SimpleStatus, offset: number = 0, limit: number = 10): Observable<EntityList<Project>> {
        const url = `${this.apiUrl}/projects`;
        const params = this.buildKeeParams({ offset, limit, filter: `status:EQ:'${status}'` });
        return this.http.get(url, { params, observe: "response" }).pipe(
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
    
    public getProjectActiveSprint(projectId: string): Observable<SprintStatus> {
        const url = `${this.apiUrl}/projects/${projectId}/sprints/status`;
        return this.http.get(url).pipe(
            mapToType<SprintStatus>(),
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
    
    public createProject(request: ProjectRequest): Observable<void> {
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
    
    public getProjectStoriesExtended(projectId: string, params: ProjectStoriesParams): Observable<EntityList<ExtendedStory>> {
        const url = `${this.apiUrl}/projects/${projectId}/stories`;
        return this.http.get(url, { params: this.parseParams(params), observe: "response" }).pipe(
            mapToType<HttpResponse<ExtendedStory[]>>(),
            map((res: HttpResponse<ExtendedStory[]>) => {
                return EntityList.of(
                    res.body!,
                    parseInt(res.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
    }
    
    private parseParams(params: ProjectStoriesParams): HttpParams {
        let p = new HttpParams();
        p = p.set("limit", params.limit!);
        p = p.set("offset", params.offset!);
        p = p.set("numberIdSort", params.numberIdSort!);
        
        if (params.filterRealized !== null) {
            p = p.set("filterRealized", params.filterRealized!);
        }
        if (params.filterAssigned !== null) {
            p = p.set("filterAssigned", params.filterAssigned!);
        }
        return p;
    }
    
    public getUserRole(projectId: string): Observable<ProjectRole> {
        const url = `${this.apiUrl}/projects/${projectId}/roles/user`;
        return this.http.get(url).pipe(
            mapToType<ProjectRole>(),
            catchHttpError(),
        );
    }
    
    public getProject(projectId: string): Observable<Project> {
        const url = `${this.apiUrl}/projects/${projectId}`;
        return this.http.get(url).pipe(
            mapToType<Project>(),
            catchHttpError(),
        );
    }
    
    public removeProject(projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/disable`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public activateProject(projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/activate`;
        return this.http.post(url, null).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getProjectMembers(projectId: string, params: KeeQuery, wrapped?: "nowrap"): Observable<ProjectMember[]>;
    public getProjectMembers(projectId: string, params: KeeQuery, wrapped?: "wrap"): Observable<EntityList<ProjectMember>>;
    public getProjectMembers(projectId: string, {
        offset = 0,
        limit = 10,
        order,
        filter
    }: KeeQuery, wrapped: WrapOption = "wrap"): Observable<any> {
        const url = `${this.apiUrl}/projects/${projectId}/members`;
        const keeParams = this.buildKeeParams({ offset, limit, order, filter });
        return this.http.get(url, { params: keeParams, observe: "response" }).pipe(
            mapToType<HttpResponse<ProjectMember[]>>(),
            map((res: HttpResponse<ProjectMember[]>) => {
                if (wrapped === "wrap") {
                    return EntityList.of(
                        res.body!,
                        parseInt(res.headers.get("x-total-count")!),
                    );
                } else {
                    return res.body!;
                }
            }),
            catchHttpError(),
        );
    }
    
    public queryProjectMembers(projectId: string, query: string): Observable<UserProfile[]> {
        const url = `${this.apiUrl}/projects/${projectId}/members/query`;
        const params = { query };
        return this.http.get(url, { params }).pipe(
            mapToType<UserProfile[]>(),
            catchHttpError(),
        );
    }
    
    public getProjectWallPosts(projectId: string, offset: number = 0, limit: number = 0, order: string = "DESC"): Observable<EntityList<ProjectWallPost>> {
        const url = `${this.apiUrl}/projects/${projectId}/posts`;
        const params = this.buildKeeParams({ offset, limit, order: `createdAt ${order}` });
        return this.http.get(url, { params, observe: "response" }).pipe(
            mapToType<HttpResponse<ProjectWallPost[]>>(),
            map((res: HttpResponse<ProjectWallPost[]>) => {
                return EntityList.of(
                    res.body!,
                    parseInt(res.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
    }
    
    public addProjectWallPost(projectId: string, post: Partial<ProjectWallPost>): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/posts`;
        return this.http.post(url, post).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getProjectRolesCount(projectId: string): Observable<ProjectRolesCount> {
        const url = `${this.apiUrl}/projects/${projectId}/roles/count`;
        return this.http.get(url).pipe(
            mapToType<ProjectRolesCount>(),
            catchHttpError(),
        );
    }
    
    public updateProject(projectId: string, request: ProjectRequest): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}`;
        return this.http.put(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    private buildKeeParams({ offset = 0, limit = 10, order, filter }: KeeQuery): HttpParams {
        let params = new HttpParams();
        params = params.set("offset", offset);
        params = params.set("limit", limit);
        if (order) {
            params = params.set("order", order);
        }
        if (filter) {
            params = params.set("filter", filter);
        }
        return params;
    }
    
    private buildFilterString(filter: StoriesFilter): string {
        if (filter === "REALIZED") {
            return "realized:EQ:true"
        } else if (filter === "NOT_REALIZED") {
            return "realized:EQ:false or realized:ISNULL"
        } else if (filter === "NOT_ESTIMATED") {
            return "timeEstimate:ISNULL"
        } else if (filter === "ESTIMATED") {
            return "timeEstimate:ISNOTNULL"
        }
        return "";
    }
}
