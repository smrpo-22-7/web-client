import { combineLatest, Observable, take } from "rxjs";
import { NavContext } from "@context";
import { AuthService } from "@services";
import { mapToVoid } from "@utils";

export function AppConfigFactory(navContext: NavContext, auth: AuthService): () => Observable<void> {
    return () => {
        navContext.initializeContext();
        return combineLatest([
            auth.initialize()
        ]).pipe(
            mapToVoid(),
            take(1)
        );
    };
}
