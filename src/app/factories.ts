import { combineLatest, Observable, take } from "rxjs";
import { NavContext } from "@context";
import { AuthService } from "@services";
import { mapToVoid } from "@utils";

export function AppConfigFactory(navContext: NavContext, auth: AuthService): () => Observable<void> {
    return () => {
        return combineLatest([
            auth.initialize(),
            navContext.initializeContext(),
        ]).pipe(
            mapToVoid(),
            take(1)
        );
    };
}
