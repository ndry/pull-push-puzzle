import { v3 } from "./utils/v";
import { cxy } from "./utils/hgx";
import { cx } from "@emotion/css";


const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);
const addLoopUndef = (v: number | undefined, dv: number, cap: number) => {
    const v1 = loop((v ?? cap) + dv, cap + 1);
    return (v1 === cap) ? undefined : v1;
};

export function TokenKindEditor({
    c, value, valueCap, onInput,
}: {
    c: v3;
    value: number;
    valueCap: number;
    onInput: (value: number) => unknown;
}) {
    return <circle
        className={cx("Token", `Token${value}`)}
        {...cxy(c)}
        onMouseDown={(ev) => {
            if (ev.button === 0 || ev.button === 2) {
                const dx = -(ev.button - 1);
                onInput(loop(value + dx, valueCap));
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
        className={cx({
            "Token": value !== undefined,
            [`Token${value}`]: value !== undefined,
            "cell": value === undefined,
        },)}
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
        onMouseEnter={() => console.log("Mouse over coords (hex cube)",c)}
        onContextMenu={ev => ev.preventDefault()} />;
}
