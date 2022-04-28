import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import { BaseError, EntityList } from "@mjamsek/prog-utils";
import { NotFoundError, TaskHour, TaskWorkSpent } from "@lib";

@Injectable({
    providedIn: "root"
})
export class TaskService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public acceptTaskRequest(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}/request`;
        return this.http.post(url, null).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public declineTaskRequest(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}/request`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public clearAssignee(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}/assignee`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public updateTask(taskId: string, task: Partial<Task>): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}`;
        return this.http.patch(url, task).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public deleteTask(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public startWorkingOnTask(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/tasks/${taskId}/start-work`;
        return this.http.post(url, null).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public stopWorkingOnTask(projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/end-active-task`;
        return this.http.post(url, null).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getActiveTask(projectId: string): Observable<TaskHour | null> {
        const url = `${this.apiUrl}/projects/${projectId}/active-task`;
        return this.http.get(url).pipe(
            mapToType<TaskHour>(),
            catchHttpError(),
            catchError((err: BaseError) => {
                if (err instanceof NotFoundError) {
                    return of(null);
                }
                return throwError(() => err);
            }),
        );
    }
    
    public getUserTaskHours(projectId: string, limit: number, offset: number): Observable<EntityList<TaskWorkSpent>> {
        const url = `${this.apiUrl}/projects/${projectId}/hours`;
        const params = {
            limit,
            offset,
        };
        return this.http.get(url, { params, observe: "response" }).pipe(
            mapToType<HttpResponse<TaskWorkSpent[]>>(),
            map((resp: HttpResponse<TaskWorkSpent[]>) => {
                return EntityList.of(
                    resp.body!,
                    parseInt(resp.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
    }
}
