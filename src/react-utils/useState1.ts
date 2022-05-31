import update from "immutability-helper";
import { useState } from "preact/hooks";

export const createStateUpdater = <T,>(setState: (_: (prev: T) => T) => unknown) =>
    ($spec: Parameters<typeof update<T>>[1]) => setState(prev => update(prev, $spec));

export function useState1<S>(initialState: S | (() => S)) {
    const [state, setState] = useState(initialState);
    return [state, setState, createStateUpdater(setState)] as const;
}