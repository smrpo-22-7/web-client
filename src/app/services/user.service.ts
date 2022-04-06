import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { BaseError, EntityList } from "@mjamsek/prog-utils";

import { API_URL } from "@injectables";
import {
    ChangePasswordRequest,
    ConflictError,
    SimpleStatus,
    User,
    UsernameCheckRequest, UserPreference,
    UserProfile,
    UserRegisterRequest
} from "@lib";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import UserPreferenceKey = UserPreference.UserPreferenceKey;


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
        );
    }
    
    public updateUserCredentials(password: string, newPassword: string): Observable<void> {
        const url = `${this.apiUrl}/users/update-credentials`;
        const payload: ChangePasswordRequest = {
            password,
            newPassword,
        };
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

    public queryUser(query: string, limit: number): Observable<User[]> {
        const url = `${this.apiUrl}/users`;
        return this.http.get(url, {
            params: {
                limit,
                filter: `username:LIKEIC:'%${query}%'`,
            }
        }).pipe(
            mapToType<User[]>(),
            catchHttpError(),
        );
    }
    
    public getUsers(status: SimpleStatus, offset: number = 0, limit: number = 10): Observable<EntityList<User>> {
        const url = `${this.apiUrl}/users`;
        return this.http.get(url, {
            observe: "response",
            params: {
                limit,
                offset,
                filter: `status:EQ:'${status}'`
            }
        }).pipe(
            mapToType<HttpResponse<User[]>>(),
            map((resp: HttpResponse<User[]>) => {
                return EntityList.of(
                    resp.body!,
                    parseInt(resp.headers.get("x-total-count")!),
                );
            }),
            catchHttpError(),
        );
    }
    
    public getUserPreferences(preferenceKeys: string[]): Observable<Map<UserPreferenceKey, UserPreference>> {
        const url = `${this.apiUrl}/users/preferences`;
        return this.http.post(url, { keys: preferenceKeys }).pipe(
            mapToType<Record<string, UserPreference>>(),
            map((resp: Record<string, UserPreference>) => {
                const map = new Map<UserPreferenceKey, UserPreference>();
                Object.keys(resp).forEach(key => {
                    map.set(key, resp[key]);
                });
                return map;
            }),
            catchHttpError(),
        );
    }
    
    public updateUserPreference(userPreference: UserPreference): Observable<void> {
        const url = `${this.apiUrl}/users/preferences`;
        return this.http.patch(url, userPreference).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
}
