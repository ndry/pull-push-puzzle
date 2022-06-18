import { v3 } from "./utils/v";
import { cxy } from "./utils/hgx";
import { cx, css } from "@emotion/css";
import { Updater } from "./react-utils/useUpdate";


const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);
const addLoopUndef = (v: number | undefined, dv: number, cap: number) => {
    const v1 = loop((v ?? cap) + dv, cap + 1);
    return (v1 === cap) ? undefined : v1;
};

export const _css = css`
    & {
        stroke: black;
        stroke-width: 0.01px;
        r: 0.3px;
        fill: transparent;
    }
`;

export function TokenKindEditor({
    c, kindCap, kindUpdater: [kind, updKind],
}: {
    c: v3;
    kindUpdater: Updater<number>,
    kindCap: number;
}) {
    return <circle
        className={cx(_css, css`& { fill: var(--kindColor${kind}) }`)}
        {...cxy(c)}
        onMouseDown={(ev) => {
            if (ev.button === 0 || ev.button === 2) {
                const dx = -(ev.button - 1);
                updKind({ $set: loop(kind + dx, kindCap) });
            }
            ev.preventDefault();
        }}
        onContextMenu={ev => ev.preventDefault()} />;
}

export function TokenKindUndefEditor({
    c, value, valueCap, onInput,
}: {
    c: v3;
    value: number | undefined;
    valueCap: number;
    onInput: (value: number | undefined) => unknown;
}) {
    return <circle
        className={cx(_css,
            value !== undefined
                ? css`& { fill: var(--kindColor${value}) }`
                : undefined)}
        {...cxy(c)}
        onMouseDown={(ev) => {
            if (ev.button === 0 || ev.button === 2) {
                const dx = -(ev.button - 1);
                onInput(addLoopUndef(value, dx, valueCap));
            }
            if (value !== undefined && ev.button === 1) {
                onInput(undefined);
            }
            ev.preventDefault();
        }}
        onMouseEnter={() => console.log("Mouse over coords (hex cube)", c)}
        onContextMenu={ev => ev.preventDefault()} />;
}
