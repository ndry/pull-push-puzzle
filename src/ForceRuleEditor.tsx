import { css, cx } from "@emotion/css";
import * as hg from "./utils/hg";
import { v3 } from "./utils/v";
import { ForceRule, getRadiusKind, getRadiusDirection } from "./simulation";
import { hgDiscDots } from "./SimulationPlayer";
import { HgCircle, HgLine } from "./utils/hgx";
import update from "immutability-helper";

const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);

export const _css = css`
    & {
        height: 200px;
        border: 1px solid;
        display: block;
    }
`

export function ForceRuleEditor({
    colorMap, value, onInput,
}: {
    colorMap: string[];
    value: ForceRule;
    onInput: (value: ForceRule) => unknown;
}) {
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));

    const sourceKindAdd = (x: number) => upd({ sourceKind: { $set: loop(value.sourceKind + x, colorMap.length) } });
    const targetKindAdd = (x: number) => upd({ targetKind: { $set: loop(value.targetKind + x, colorMap.length) } });
    const radiusKindSet = (x: number) => upd({ radiusKind: { $set: x } });
    const directionKindAdd = (x: number) => upd({ directionKind: { $set: loop(value.directionKind + x, 6) } });

    const dots = [...hgDiscDots(3)];
    const color = colorMap[value.targetKind];
    return <svg className={cx("ForceRuleEditor", _css)} viewBox="-2.7 -2.7 7.4 5.4">
        {colorMap.map(color => <marker id={`arrow_${color.substring(1)}`} viewBox="0 -5 10 10" refX="10" orient="auto">
            <path fill={color} d="M0,-5L10,0L0,5"></path>
        </marker>)}
        {dots.map(pos => {
            const fill = (v3.len(pos) === 0 && colorMap[value.sourceKind]) ||
                (getRadiusKind(pos) === value.radiusKind && colorMap[value.targetKind]) ||
                "white";
            const onMouseDown = (ev: MouseEvent) => {
                if (ev.button === 0 || ev.button === 2) {
                    const dx = -(ev.button - 1);
                    if (v3.len(pos) === 0) {
                        sourceKindAdd(dx);
                    } else {
                        const rk = getRadiusKind(pos);
                        if (rk === value.radiusKind) {
                            targetKindAdd(dx);
                        } else {
                            if (rk !== undefined) {
                                radiusKindSet(rk);
                            }
                        }
                    }
                }
                ev.preventDefault();
            };
            return <HgCircle
                c={pos}
                fill={fill}
                onMouseDown={onMouseDown}
                onContextMenu={ev => ev.preventDefault()}
                stroke="black" stroke-width="0.01" r="0.3" />;
        })}
        {dots.filter(pos => getRadiusKind(pos) === value.radiusKind).map(pos => {
            const color = colorMap[value.targetKind];
            const dir = getRadiusDirection[getRadiusKind(pos)!](pos);
            return <HgLine
                stroke={color}
                stroke-width="0.1"
                p1={pos} p2={v3.add(pos, hg.cubeRotate60CvTimes(dir, value.directionKind))}
                marker-end={`url(#arrow_${color.substring(1)})`}
                pointer-events="none" />;
        })}
        <g transform="translate(3.35)">
            <circle
                fill="white" stroke="black" stroke-width="0.01" r="0.3"
                onMouseDown={ev => {
                    if (ev.button === 0 || ev.button === 2) {
                        const dx = -(ev.button - 1);
                        directionKindAdd(dx);
                    }
                    ev.preventDefault();
                }}
                onContextMenu={ev => ev.preventDefault()} />
            <HgLine
                stroke={color}
                stroke-width="0.1"
                p1={[0, 0]} p2={hg.cubeRotate60CvTimes(hg.cubeFlatNorth, value.directionKind)}
                marker-end={`url(#arrow_${color.substring(1)})`}
                pointer-events="none" />
        </g>
    </svg>;
}
