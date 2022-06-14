import { css, cx } from "@emotion/css";
import * as hg from "./utils/hg";
import { v3 } from "./utils/v";
import { ForceRule, getRadiusKind, getRadiusDirection } from "./simulation";
import { hgDiscDots } from "./utils/misc";
import { cxy, xy12 } from "./utils/hgx";
import update from "immutability-helper";
import { TokenKindEditor } from "./TokenKindEditor";
export type Element = import("preact").JSX.Element;

const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);

export const _css = css`
    & {
        height: 200px;
        border: 1px solid;
        display: block;
    }
`;

export function ForceRuleEditor({
    colorMap, value, onInput,
}: {
    colorMap: string[];
    value: ForceRule;
    onInput: (value: ForceRule) => unknown;
}) {
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));

    const radiusKindSet = (x: number) => upd({ radiusKind: { $set: x } });
    const directionKindAdd = (x: number) => upd({ directionKind: { $set: loop(value.directionKind + x, 6) } });

    const dots = [...hgDiscDots(3)];
    const color = colorMap[value.targetKind];
    return <svg className={cx("ForceRuleEditor", _css)} viewBox="-2.7 -3.1 5.4 7.8">
        {colorMap.map(color => <marker id={`arrow_${color.substring(1)}`} viewBox="0 -5 10 10" refX="10" orient="auto">
            <path fill={color} d="M0,-5L10,0L0,5"></path>
        </marker>)}
        {dots.map(pos => {
            if (v3.lenSq(pos) === 0) {
                return <TokenKindEditor
                    c={pos}
                    value={value.sourceKind}
                    valueCap={colorMap.length}
                    onInput={value => upd({ sourceKind: { $set: value } })}
                />;
            }
            const rk = getRadiusKind(pos);
            if (rk === value.radiusKind) {
                return <TokenKindEditor
                    c={pos}
                    value={value.targetKind}
                    valueCap={colorMap.length}
                    onInput={value => upd({ targetKind: { $set: value } })}
                />;
            }
            return <circle
                {...cxy(pos)}
                className={cx("cell")}
                onMouseDown={(ev) => {
                    if (ev.button === 0 || ev.button === 2) {
                        if (rk !== undefined) {
                            radiusKindSet(rk);
                        }
                    }
                    ev.preventDefault();
                }}
                onContextMenu={ev => ev.preventDefault()} />;
        })}
        {dots.filter(pos => getRadiusKind(pos) === value.radiusKind).map(pos => {
            const color = colorMap[value.targetKind];
            const dir = getRadiusDirection[getRadiusKind(pos)!](pos);
            return <line
                stroke={color}
                stroke-width="0.1"
                {...xy12(pos, v3.add(pos, hg.cubeRotate60CvTimes(dir, value.directionKind)))}
                marker-end={`url(#arrow_${color.substring(1)})`}
                pointer-events="none" />;
        })}
        <g transform="translate(0, 3.55)">
            <circle
                className={cx("cell")}
                onMouseDown={ev => {
                    if (ev.button === 0 || ev.button === 2) {
                        const dx = -(ev.button - 1);
                        directionKindAdd(dx);
                    }
                    ev.preventDefault();
                }}
                onContextMenu={ev => ev.preventDefault()} />
            <line
                stroke={color}
                stroke-width="0.1"
                {...xy12([0, 0], hg.cubeRotate60CvTimes(hg.cubeFlatNorth, value.directionKind))}
                marker-end={`url(#arrow_${color.substring(1)})`}
                pointer-events="none" />
        </g>
    </svg>;
}
