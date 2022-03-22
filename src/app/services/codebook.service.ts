import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SCHEMA_URL } from "@injectables";
import { BehaviorSubject, map, Observable, of, switchMap, tap } from "rxjs";
import { mapToType } from "@utils";
import { OpenApiDefinition } from "@lib";


@Injectable(({
    providedIn: "root"
}))
export class CodebookService {
    
    private oas$ = new BehaviorSubject<OpenApiDefinition | null>(null);
    
    constructor(@Inject(SCHEMA_URL) private schemaUrl: string,
        private http: HttpClient) {
    }
    
    public getCodebook(codebook: string): Observable<string[]> {
        return this.oas$.pipe(
            switchMap((openapi) => {
                if (openapi === null) {
                    return this.http.get(this.schemaUrl).pipe(
                        mapToType<OpenApiDefinition>(),
                        tap((openapi) => {
                            this.oas$.next(openapi);
                        })
                    );
                }
                return of(openapi);
            }),
            map((openapi) => {
                if (openapi.components.schemas[codebook]) {
                    return openapi.components.schemas[codebook].enum;
                }
                throw new Error("Codebook not found!");
            }),
        );
    }
    
}
