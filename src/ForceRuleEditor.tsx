import { css, cx } from "@emotion/css";
import * as hg from "./utils/hg";
import { v3 } from "./utils/v";
import { ForceRule, getRadiusKind, getRadiusDirection } from "./simulation";
import { hgDiscDots } from "./utils/misc";
import { cxy, xy12 } from "./utils/hgx";
import update from "immutability-helper";
import { TokenKindEditor } from "./TokenKindEditor";
import * as it from "./utils/it";
import { apply, pipe } from "./utils/pipe";
export type Element = import("preact").JSX.Element;
import { _css as cellCss } from "./TokenKindEditor";
import { forceCss, ForceMarkers } from "./SpaceEditor";

const loop = (v: number, cap: number) => (v % cap) + ((v < 0) ? cap : 0);

export const _css = css`
    & {
        height: 200px;
        border: 1px solid;
        display: block;
    }
`;

const dots = [...hgDiscDots(3)];

export function ForceRuleEditor({
    kindCount, value, onInput,
}: {
    kindCount: number;
    value: ForceRule;
    onInput: (value: ForceRule) => unknown;
}) {
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));

    const radiusKindSet = (x: number) => upd({ radiusKind: { $set: x } });
    const directionKindAdd = (x: number) => upd({ directionKind: { $set: loop(value.directionKind + x, 6) } });

    return <svg className={cx("ForceRuleEditor", _css)} viewBox="-2.7 -3.1 5.4 7.8">
        <ForceMarkers kindCount={kindCount} />

        {dots.map(pos => {
            if (v3.lenSq(pos) === 0) {
                return <TokenKindEditor
                    c={pos}
                    value={value.sourceKind}
                    valueCap={kindCount}
                    onInput={value => upd({ sourceKind: { $set: value } })}
                />;
            }
            const rk = getRadiusKind(pos);
            if (rk === value.radiusKind) {
                return <TokenKindEditor
                    c={pos}
                    value={value.targetKind}
                    valueCap={kindCount}
                    onInput={value => upd({ targetKind: { $set: value } })}
                />;
            }
            return <circle
                {...cxy(pos)}
                className={cx(cellCss)}
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
            const dir = getRadiusDirection[getRadiusKind(pos)!](pos);
            return <line
                className={cx(forceCss(value.targetKind))}
                {...xy12(pos, v3.add(pos, hg.cubeRotate60CvTimes(dir, value.directionKind)))}
                pointer-events="none" />;
        })}
        <g transform="translate(0, 3.55)">
            <circle
                className={cx(cellCss)}
                onMouseDown={ev => {
                    if (ev.button === 0 || ev.button === 2) {
                        const dx = -(ev.button - 1);
                        directionKindAdd(dx);
                    }
                    ev.preventDefault();
                }}
                onContextMenu={ev => ev.preventDefault()} />
            <line
                className={cx(forceCss(value.targetKind))}
                {...xy12([0, 0], hg.cubeRotate60CvTimes(hg.cubeFlatNorth, value.directionKind))}
                pointer-events="none" />
        </g>
    </svg>;
}
