import { css, cx } from "@emotion/css";
import { v3 } from "./utils/v";
import { calcForces, ForceRule, Space } from "./simulation";
import { hgDiscDots } from "./SimulationPlayer";
import { HgCircle, HgLine } from "./utils/hgx";
import update from "immutability-helper";

const _css = css`
    & {
        height: 600px;
        border: 1px solid;
        display: block;
    }
`

export function SpaceEditor({
    colorMap, value, onInput, forceRules,
}: {
    colorMap: string[];
    value: Space;
    onInput: (value: Space) => unknown;
    forceRules: ForceRule[];
}) {
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));
    const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);
    const addLoopUndef = (v: number | undefined, dv: number, cap: number) => {
        const v1 = loop((v ?? cap) + dv, cap + 1);
        return (v1 === cap) ? undefined : v1;
    };
    return <svg className={cx("SpaceEditor", _css)} viewBox="-10 -10 20 20">
        {colorMap.map(color => <marker id={`arrow_${color.substring(1)}`} viewBox="0 -5 10 10" refX="10" orient="auto">
            <path fill={color} d="M0,-5L10,0L0,5"></path>
        </marker>)}

        ${[...hgDiscDots(10)].map(pos => {
            const btnIndex = value.findIndex(b => v3.eq(b.pos, pos));
            const onMouseDown = (ev: MouseEvent) => {
                const kind = btnIndex < 0 ? undefined : value[btnIndex].kind;
                if (ev.button === 0 || ev.button === 2) {
                    const dx = -(ev.button - 1);
                    let newKind = addLoopUndef(kind, dx, colorMap.length);
                    if (newKind === undefined) {
                        upd({ $splice: [[btnIndex, 1]] });
                    } else if (kind === undefined) {
                        upd({ $push: [{ kind: newKind, pos }] });
                    } else {
                        upd({ [btnIndex]: { kind: { $set: newKind } } });
                    }
                }
                if (btnIndex >= 0 && ev.button === 1) {
                    upd({ $splice: [[btnIndex, 1]] });
                }
                ev.preventDefault();
            };
            return <HgCircle
                c={pos}
                onMouseDown={onMouseDown}
                onContextMenu={ev => ev.preventDefault()}
                fill={btnIndex < 0 ? "white" : colorMap[value[btnIndex].kind]}
                stroke="black"
                stroke-width="0.01"
                r="0.3" />;
        })}
        ${calcForces(forceRules, value)
            .filter(({ vec }) => v3.len(vec) > 0)
            .map(({ target, vec }) => {
                const color = colorMap[target.kind];
                return <HgLine
                    stroke={color}
                    stroke-width="0.1"
                    p1={target.pos} p2={v3.add(target.pos, vec)}
                    marker-end={`url(#arrow_${color.substring(1)})`}
                    pointer-events="none" />;
            })}

    </svg>;
}
