import { useEffect, useState, Inputs } from "preact/hooks";


export function usePromise<T>(
    promiseFactory: () => Promise<T> | T,
    inputs?: Inputs
) {
    const [state, setState] = useState<T>();
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const state = await promiseFactory();
            if (cancelled) { return; }
            setState(state);
        })();
        return () => cancelled = true;
    }, inputs);
    return state;
}
