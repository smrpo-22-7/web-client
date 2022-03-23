import { Inject, Injectable } from "@angular/core";
import { ProjectRole } from "@lib";

import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import { ChangePasswordRequest, ConflictError, User, UsernameCheckRequest, UserProfile, UserRegisterRequest, ProjectRegisterRequest, NameCheckRequest, SprintRegisterRequest } from "@lib";
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

}