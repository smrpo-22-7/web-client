import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import { ChangePasswordRequest, ConflictError, UsernameCheckRequest, UserProfile, UserRegisterRequest } from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class UserService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public getUserProfile(): Observable<UserProfile> {
        const url = `${this.apiUrl}/users/profile`;
        return this.http.get(url).pipe(
            mapToType<UserProfile>(),
            catchHttpError(),
        );
    }
    
    /**
     * Checks if there already exists user with given username
     * @param username
     * @return <code>true</code> if username already exists (409 Conflict), <code>false</code> otherwise.
     */
    public checkUsernameExists(username: string): Observable<boolean> {
        const url = `${this.apiUrl}/users/username-check`;
        const payload: UsernameCheckRequest = {
            username,
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
        )
    }
    
    public updateUserCredentials(password: string, newPassword: string): Observable<void> {
        const url = `${this.apiUrl}/users/update-credentials`;
        const payload: ChangePasswordRequest = {
            password,
            newPassword,
        }
        return this.http.post(url, payload).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public createUser(request: UserRegisterRequest): Observable<void> {
        const url = `${this.apiUrl}/users`;
        return this.http.post(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public updateUserProfile(userProfile: UserProfile): Observable<void> {
        const url = `${this.apiUrl}/users/profile`;
        return this.http.patch(url, userProfile).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
}
