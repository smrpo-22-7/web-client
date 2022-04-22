import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { ProjectWallComment, ProjectWallPost, SortOrder } from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";

@Injectable({
    providedIn: "root"
})
export class ProjectWallService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public getProjectWallPosts(projectId: string, offset: number = 0, limit: number = 0, order: SortOrder = "DESC"): Observable<EntityList<ProjectWallPost>> {
        const url = `${this.apiUrl}/projects/${projectId}/posts`;
        const params = {
            offset,
            limit,
            sort: order,
        };
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
    
    public getPost(postId: string): Observable<ProjectWallPost> {
        const url = `${this.apiUrl}/projects/posts/${postId}`;
        return this.http.get(url).pipe(
            mapToType<ProjectWallPost>(),
            catchHttpError(),
        );
    }
    
    public getPostComments(postId: string, limit: number = 10, offset: number = 0, order: SortOrder): Observable<EntityList<ProjectWallComment>> {
        const url = `${this.apiUrl}/projects/posts/${postId}/comments`;
        const params = {
            offset,
            limit,
            order: "createdAt " + order,
        };
        return this.http.get(url, { params, observe: "response" }).pipe(
            mapToType<HttpResponse<ProjectWallComment[]>>(),
            map((res: HttpResponse<ProjectWallComment[]>) => {
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
    
    public addPostComment(postId: string, comment: Partial<ProjectWallComment>): Observable<void> {
        const url = `${this.apiUrl}/projects/posts/${postId}/comments`;
        return this.http.post(url, comment).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public removePost(postId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/posts/${postId}`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public removeComment(commentId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/posts/comments/${commentId}`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
}
