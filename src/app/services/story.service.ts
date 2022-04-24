import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import {
    ConflictError,
    NameCheckRequest,
    Story,
    StoryRegisterRequest, StoryState,
    Task, UserProfile,
} from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import { API_URL } from "@injectables";
import { HttpClient } from "@angular/common/http";
import { BaseError } from "@mjamsek/prog-utils";

@Injectable({
    providedIn: "root"
})
export class StoryService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public createStory(request: StoryRegisterRequest, projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/stories`;
        return this.http.post(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getStoryState(storyId: string): Observable<StoryState> {
        const url = `${this.apiUrl}/stories/${storyId}/state`;
        return this.http.get(url).pipe(
            mapToType<StoryState>(),
            catchHttpError(),
        );
    }
    
    public checkStoryTitleExists(projectId: string, title: string): Observable<boolean> {
        const url = `${this.apiUrl}/projects/${projectId}/stories/name-check`;
        const payload: NameCheckRequest = {
            value: title,
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
    
    public updateStoryTimeEstimate(storyId: string, newEstimate: number): Observable<void> {
        const url = `${this.apiUrl}/stories/${storyId}/time-estimate`;
        const payload: Partial<Story> = {
            timeEstimate: newEstimate,
        };
        return this.http.patch(url, payload).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public getStoryTasks(storyId: string): Observable<Task[]> {
        const url = `${this.apiUrl}/stories/${storyId}/tasks`;
        return this.http.get(url).pipe(
            mapToType<Task[]>(),
            catchHttpError(),
        );
    }
    
    public createTask(storyId: string, task: Partial<Task>): Observable<void> {
        const url = `${this.apiUrl}/stories/${storyId}/tasks`;
        return this.http.post(url, task).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }


    public removeStory(storyId: string): Observable<void> {
        const url = `${this.apiUrl}/stories/${storyId}`;
        return this.http.delete(url).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }

    public getStoryById(storyId: string): Observable<StoryRegisterRequest> {
        const url = `${this.apiUrl}/stories/${storyId}`;
        return this.http.get(url).pipe(
            mapToType<StoryRegisterRequest>(),
            catchHttpError(),
        );
    }

    public editStory(request: StoryRegisterRequest, storyId: string): Observable<void> {
        const url = `${this.apiUrl}/stories/${storyId}`;
        return this.http.patch(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
}
