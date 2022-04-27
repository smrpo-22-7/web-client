import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import { EntityList } from "@mjamsek/prog-utils";
import { TaskWorkSpent, User } from "@lib";

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
