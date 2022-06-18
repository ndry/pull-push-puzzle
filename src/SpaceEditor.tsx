import { css, cx } from "@emotion/css";
import { calcStep, RuleSet, Space } from "./simulation";
import { xy, cxy, xy12 } from "./utils/hgx";
import update from "immutability-helper";
import { TokenKindUndefEditor } from "./TokenKindEditor";
import * as it from "./utils/it";
import { apply, pipe } from "./utils/pipe";
import { hgDiscDots } from "./utils/misc";
import { v3 } from "./utils/v";

const _css = css`
    & {
        height: 600px;
        border: 1px solid;
        display: block;
    }
`;

export const ForceMarkers = ({ kindCount }: { kindCount: number }) =>
    <>{apply(it.inf(), pipe(
        it.take(kindCount),
        it.map(i => <marker
            id={`forceArrow${i}`}
            className={css`& path { fill: var(--kindColor${i}) }`}
            viewBox="0 -5 10 10"
            refX="10"
            orient="auto"><path d="M0,-5L10,0L0,5"></path>
        </marker>),
        it.toArray()
    ))}</>;

export const forceCss = (kind: number) => css`& {
    stroke-width: 0.1px;
    stroke: var(--kindColor${kind});
    marker-end: url(#forceArrow${kind})
}`


export function SpaceEditor({
    kindCount, value, setValue: onInput, ruleSet, stepFrac,
}: {
    kindCount: number;
    value: Space;
    setValue: (value: Space) => unknown;
    ruleSet: RuleSet;
    stepFrac: number;
}) {
    const step = calcStep(ruleSet, value);
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));


    // phases:
    // stepFrac < t0 -- editor + still
    const t0 = 0.2;
    const s0 = Math.min(1, Math.max(0, (stepFrac - 0) / (t0 - 0)));
    const p0 = stepFrac >= 0 && stepFrac < t0;
    // stepFrac < t1 -- produce
    const t1 = 0.4;
    const s1 = Math.min(1, Math.max(0, (stepFrac - t0) / (t1 - t0)));
    const p1 = stepFrac >= t0 && stepFrac < t1;
    // stepFrac < t2 -- move
    const t2 = 0.8;
    const s2 = Math.min(1, Math.max(0, (stepFrac - t1) / (t2 - t1)));
    const p2 = stepFrac >= t1 && stepFrac < t2;
    const s3 = Math.min(1, Math.max(0, (stepFrac - t2) / (1 - t2)));
    const p3 = stepFrac >= t2;
    // stepFrac < 1 -- consume
    const PhaseEditor = () => <>
        {(p0 || p1) && step.space.map(({ pos, kind }, i) => <TokenKindUndefEditor
            c={pos}
            value={kind}
            valueCap={kindCount}
            onInput={(newKind => {
                if (newKind === undefined) {
                    upd({ $splice: [[i, 1]] });
                } else {
                    upd({ [i]: { kind: { $set: newKind } } });
                }
            })}
        />)}
        {(p0 || p1) && step.producees.map(({ pos, kind }) => <circle
            {...cxy(pos)}
            r={0.1 + s1 * 0.2}
            className={cx(css`& {
                fill: var(--kindColor${kind});
            }`)}
            pointer-events="none" />)}
        {p2 && step.forces.map(({ target: { pos, kind }, vec }) => <circle
            {...cxy(v3.add(pos, v3.scale(vec, -1 + s2)))}
            r={0.3}
            className={cx(css`& {
                fill: var(--kindColor${kind});
                stroke: black;
                stroke-width: 0.01px;
            }`)}
            pointer-events="none" />)}
        {p3 && step.nextSpace1.map(({ pos, kind }) => <circle
            {...cxy(pos)}
            r={0.3}
            className={cx(css`& {
                fill: var(--kindColor${kind});
                stroke: black;
                stroke-width: 0.01px;
            }`)}
            pointer-events="none" />)}
        {p3 && step.consumees.map(({ pos, kind }) => <circle
            {...cxy(pos)}
            r={0.3 - s3 * 0.2}
            className={cx(css`& {
                fill: var(--kindColor${kind});
                stroke: black;
                stroke-width: 0.01px;
            }`)}
            pointer-events="none" />)}
        {step.forces.map(({ target: { kind, pos }, vec }) =>
            v3.len(vec) > 0
                ? <line
                    className={cx(forceCss(kind))}
                    {...xy12(v3.sub(pos, vec), pos)}
                    pointer-events="none" />
                : <></>)}
        {step.consumees.map(({ pos, kind }) => <circle
            {...cxy(pos)}
            className={cx(css`& {
                r: 0.1px;
                stroke-width: 0.04px;
                fill: transparent;
                stroke: var(--kindColor${kind});
            }`)}
            pointer-events="none" />)}
        {step.collisions.map(collision => <>
            <text
                {...xy(collision[0].pos)}
                font-size="0.4px"
                pointer-events="none"
            >. Collision: {JSON.stringify(collision)}</text>
        </>)}
    </>;

    return <svg className={cx("SpaceEditor", _css)} viewBox="-10 -10 20 20">
        <ForceMarkers kindCount={kindCount} />

        {[...hgDiscDots(10)].map(pos => <TokenKindUndefEditor
            c={pos}
            value={undefined}
            valueCap={kindCount}
            onInput={(newKind => {
                if (newKind !== undefined) {
                    upd({ $push: [{ kind: newKind, pos }] });
                }
            })}
        />)}

        <PhaseEditor />
    </svg>;
}
