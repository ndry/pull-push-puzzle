import { css, cx } from "@emotion/css";
import * as hg from "./utils/hg";
import { v3 } from "./utils/v";
import { Space, calcForces, ForceRule } from "./simulation";
import { HgCircle, HgLine } from "./utils/hgx";
import { useState } from "preact/hooks";

export function* hgCircleDots(radius: number, center: v3 = [0, 0, 0]) {
    if (radius === 0) { 
        yield center; 
    } else {
        for (let j = 0; j < radius; j++) {
            const ps = [
                [radius, -j] as [number, number],
                [radius - j, -radius] as [number, number],
                [radius - j - 1, j + 1] as [number, number]
            ].map(hg.axialToCube);
            for (const p of ps) {
                yield p;
                yield v3.negate(p);
            }
        }
    }
}

export function* hgDiscDots(radius: number, center: v3 = [0, 0, 0]) {
    for (let i = 0; i < radius; i++) {
        yield *hgCircleDots(i, center);
    }
}

export function ButtonView({
    colorMap, kind, hpos,
}: {
    colorMap: string[],
    kind: number,
    hpos: v3,
}) {
    const [cx, cy] = hg.axialToFlatCart(hpos);
    return <circle cx={cx} cy={cy} r="0.5" fill={colorMap[kind]}></circle>
}

export const _css = css`
    & svg {
        height: 600px;
        border: 1px solid;
    }
`

export function SimulationPlayer({
    spacetime,
    colorMap,
    forceRules,
}: {
    colorMap: string[],
    forceRules: ForceRule[],
    spacetime: Space[],
}) {
    const [t, setT] = useState(0);
    const incT = () => setT((t + 1) % spacetime.length);
    const decT = () => setT((t + spacetime.length - 1) % spacetime.length);

    const space = spacetime[t];
    
    return <div className={cx("SimulationPlayer", _css)}>
        <svg viewBox="-15 -15 30 30">
            {colorMap.map(color => <marker id={`arrow_${color.substring(1)}`} viewBox="0 -5 10 10" refX="10" orient="auto">
                <path fill={color} d="M0,-5L10,0L0,5"></path>
            </marker>)}

            ${[...hgDiscDots(30)].map(dot => <HgCircle c={dot} r="0.05" />)}
            ${space.map(({ kind, pos }) => <ButtonView colorMap={colorMap} kind={kind} hpos={pos} />)}
            ${calcForces(forceRules, space)
                .filter(({ vec }) => v3.len(vec) > 0)
                .map(({ target, vec }) => {
                    const color = colorMap[target.kind];
                    return <HgLine
                        stroke={color}
                        stroke-width="0.1"
                        p1={target.pos} p2={v3.add(target.pos, vec)}
                        marker-end={`url(#arrow_${color.substring(1)})`} />;
                })}
        </svg>
        <div>
            <span>Step: {t + 1} / {spacetime.length}</span>.....
            <button onClick={() => setT(0)}>0</button>
            <button onClick={decT}>&lt;</button>
            <button onClick={incT}>&gt;</button>
        </div>
    </div>;
}
