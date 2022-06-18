import update, { Spec } from "immutability-helper";
import { useReducer } from "preact/hooks";

// todo: Support Adding your own commands
// https://www.npmjs.com/package/immutability-helper#adding-your-own-commands

export const useUpdate = <S>(initialState: S) =>
    useReducer(update<S>, initialState);

export type Updater<S> = ReturnType<typeof useUpdate<S>>;

export const useSubUpdate =
    <S, Key extends keyof S>(
        [state, updState]: Updater<S>,
        key: Key
    ) => [
        state[key],
        (spec: Spec<S[Key]>) => updState({ [key]: spec } as Spec<S>)
    ] as Updater<S[Key]>;