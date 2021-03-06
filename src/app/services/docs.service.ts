import { Inject, Injectable } from "@angular/core";
import { API_URL } from "@injectables";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { saveAs } from "file-saver";
import { catchHttpError, mapToType, mapToVoid } from "@utils";
import { ProjectDocumentation } from "@lib";


@Injectable({
    providedIn: "root"
})
export class DocsService {
    
    constructor(@Inject(API_URL) private apiUrl: string,
                private http: HttpClient) {
    }
    
    public getDocumentationContent(projectId: string, inline: boolean, rendered: boolean): Observable<string> {
        const url = `${this.apiUrl}/projects/${projectId}/documentation/content`
        const contentType = rendered ? "text/html" : "text/markdown";
        const params = {
            attachment: inline,
        };
        const headers = new HttpHeaders({
            accept: contentType,
        });
        return this.http.get(url, { headers, params, responseType: "text" }).pipe(
            mapToType<string>(),
            catchHttpError(),
        );
    }
    
    public getDocumentation(projectId: string): Observable<ProjectDocumentation> {
        const url = `${this.apiUrl}/projects/${projectId}/documentation`
        return this.http.get(url).pipe(
            mapToType<ProjectDocumentation>(),
            catchHttpError(),
        );
    }
    
    public updateDocumentation(projectId: string, markdownContent: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/documentation`
        const request = {
            markdownContent,
        };
        return this.http.put(url, request).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public uploadDocumentationFile(projectId: string, file: File): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/documentation`
        const formData = new FormData();
        formData.set("file", file);
        
        const headers = new HttpHeaders({
            "content-type": "xxxx"
        });
        return this.http.put(url, formData, { headers }).pipe(
            mapToVoid(),
            catchHttpError(),
        );
    }
    
    public downloadDocumentationFile(projectId: string): Observable<void> {
        const url = `${this.apiUrl}/projects/${projectId}/documentation/content`;
        const params = {
            attachment: true,
        };
        const headers = new HttpHeaders({
            accept: "text/markdown",
        });
        
        return this.http.get(url, { headers, params, responseType: "blob", observe: "response" }).pipe(
            tap((resp: HttpResponse<Blob>) => {
                const blob = new Blob([resp.body!], { type: "text/markdown" });
                saveAs(blob, this.parseContentDispositionHeader(resp));
            }),
            mapToVoid(),
        )
    }
    
    private parseContentDispositionHeader(resp: HttpResponse<Blob>): string {
        const header = resp.headers.get("content-disposition")!;
        const filename = header.split(";").find(v => v.startsWith("filename"))!;
        return filename.replace("filename=", "");
    }
}
