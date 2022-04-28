import { Inject, Injectable } from "@angular/core";
import { interval, Observable, Subject } from "rxjs";
import { SocketMessage } from "@lib";
import { webSocket } from "rxjs/webSocket";
import { WS_URL } from "@injectables";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    
    private ws$: Subject<SocketMessage>;
    private open$: Subject<Event> = new Subject<Event>();
    
    constructor(@Inject(WS_URL) private wsUrl: string,
                private auth: AuthService) {
    }
    
    public connect(): Observable<Event> {
        this.ws$ = webSocket({
            url: this.wsUrl,
            openObserver: this.open$,
        });
        
        interval(60000).subscribe(() => {
            const message: SocketMessage = {
                type: "PING",
            };
            this.sendMessage(message, false);
        });
        
        return this.open$;
    }
    
    public sendMessage(message: SocketMessage, withAuthentication: boolean = true): void {
        if (!withAuthentication) {
            this.ws$.next(message);
            return;
        }
        
        this.auth.getAccessToken().subscribe({
            next: token => {
                if (token !== null) {
                    message.accessToken = token;
                    this.ws$.next(message);
                }
            },
            error: err => {
                console.error(err);
            }
        });
    }
    
    public listen(): Observable<SocketMessage> {
        return this.ws$.asObservable();
    }
    
}
