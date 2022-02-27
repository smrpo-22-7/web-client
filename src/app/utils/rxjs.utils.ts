import { map, Observable } from "rxjs";

export function mapToType<T>() {
    return function<I>(source: Observable<I>): Observable<T> {
        return source.pipe(
            map(val => val as unknown as T)
        );
    }
}

export function mapToVoid() {
    return function <T>(source: Observable<T>): Observable<void> {
        return source.pipe(
            map(() => undefined)
        );
    }
}
