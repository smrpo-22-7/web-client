import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchHttpError, mapToVoid } from "@utils";

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
}
