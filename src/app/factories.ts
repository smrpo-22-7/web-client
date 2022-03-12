import { take } from "rxjs";
import { NavContext } from "@context";

export function AppConfigFactory(navContext: NavContext) {
    return () => {
        return navContext.initializeContext().pipe(
            take(1)
        );
    };
}
