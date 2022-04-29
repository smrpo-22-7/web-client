import { catchError, filter, map, Observable, pipe, startWith, throwError } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { EntityList, UnknownError } from "@mjamsek/prog-utils";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError, InternalServerError,
    NotFoundError,
    UnauthorizedError,
    ValidationError
} from "@lib";
import { ActivatedRoute, ParamMap } from "@angular/router";

export function mapToType<T>() {
    return function <I>(source: Observable<I>): Observable<T> {
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

export function mapToEntityList<T>() {
    return function (source: Observable<HttpResponse<T[]>>): Observable<EntityList<T>> {
        return source.pipe(
            map((res: HttpResponse<T[]>) => {
                if (res.body !== null) {
                    let totalCount = res.headers.get("x-total-count");
                    if (totalCount === null) {
                        totalCount = res.body.length.toString(10);
                    }
                    return EntityList.of(res.body, parseInt(totalCount, 10));
                }
                throw TypeError("Response body is empty! Unable to map to EntityList.");
            })
        );
    }
}

export function mapHttpError(err: HttpErrorResponse) {
    if (err.status === 400) {
        return throwError(() => new BadRequestError(err.message, err))
    } else if (err.status === 401) {
        return throwError(() => new UnauthorizedError(err.message, err))
    } else if (err.status === 403) {
        return throwError(() => new ForbiddenError(err.message, err))
    } else if (err.status === 404) {
        return throwError(() => new NotFoundError(err.message, err))
    } else if (err.status === 409) {
        return throwError(() => new ConflictError(err.message, err))
    } else if (err.status === 422) {
        return throwError(() => new ValidationError(err.message, err))
    } else if (err.status === 500) {
        return throwError(() => new InternalServerError(err.message, err))
    }
    return throwError(() => new UnknownError(err.message, err));
}

export function catchHttpError() {
    return function <I>(source: Observable<I>): Observable<I> {
        return source.pipe(
            catchError(mapHttpError),
        );
    }
}

export function routeParam<T = string>(paramName: string, route: ActivatedRoute): Observable<T> {
    return route.paramMap.pipe(
        startWith(route.snapshot.paramMap),
        filter((paramMap: ParamMap) => paramMap.has(paramName)),
        map((paramMap: ParamMap) => {
            return paramMap.get(paramName) as unknown as T;
        }),
    );
}
