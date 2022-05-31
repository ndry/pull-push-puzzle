import * as rx from "rxjs";

export function* inf() { for (let i = 0; true; i++) { yield i; } }

export function* pipe<T, U>(iterable: Iterable<T>, op: rx.OperatorFunction<T, U>) {
    let subscriber: rx.Subscriber<T>;
    let pool = [] as U[];
    new rx.Observable<T>(s => subscriber = s)
        .pipe(op)
        .subscribe(v => pool.push(v));

    for (const value of iterable) {
        subscriber!.next(value);
        yield* pool;
        if (subscriber!.closed) { return; }
        pool = [];
    }

    subscriber!.complete();
}