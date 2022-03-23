import {Inject, Injectable} from "@angular/core";
import { Observable, of } from "rxjs";
import {PriorityType, ProjectRegisterRequest, StoryRegisterRequest} from "@lib";
import { catchHttpError, mapToVoid } from "@utils";
import {API_URL} from "@injectables";
import {HttpClient} from "@angular/common/http";


@Injectable({
    providedIn: "root"
})
export class StorypriorityService {



    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }

    public getPriorities(): Observable<PriorityType[]> {
        return of([
            { id: "1", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "MUST_HAVE", priorityname: "Must have" },
            { id: "2", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "COULD_HAVE", priorityname: "Could have" },
            { id: "3", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "SHOULD_HAVE", priorityname: "Should have" },
            { id: "4", createdAt: new Date(), updatedAt: new Date(), prioritytypeId: "WONT_HAVE_THIS_TIME", priorityname: "Won't have this time" }
        ]);
    }

    public createStory(request: StoryRegisterRequest, projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/stories`;
        return this.http.post(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }

}