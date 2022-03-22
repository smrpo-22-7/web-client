import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SysRole } from "@lib";
import { catchHttpError, mapToType } from "@utils";

@Injectable({
    providedIn: "root"
})
export class RoleService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public getAllSysRoles(): Observable<SysRole[]> {
        return this.http.get(`${this.apiUrl}/sys-roles`).pipe(
            mapToType<SysRole[]>(),
            catchHttpError(),
        );
    }
    
}
