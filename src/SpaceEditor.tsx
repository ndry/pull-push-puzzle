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

export function SpaceEditor({
    kindCount, value, setValue: onInput, ruleSet,
}: {
    kindCount: number;
    value: Space;
    setValue: (value: Space) => unknown;
    ruleSet: RuleSet;
}) {
    const step = calcStep(ruleSet, value);
    const upd = (x: Parameters<typeof update<typeof value>>[1]) => onInput(update(value, x));
    return <svg className={cx("SpaceEditor", _css)} viewBox="-10 -10 20 20">
        {apply(it.inf(), pipe(
            it.take(kindCount),
            it.map(i => <marker
                id={`forceArrow${i}`}
                viewBox="0 -5 10 10"
                refX="10"
                orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>),
            it.toArray()
        ))}

        ${[...hgDiscDots(10)].map(pos => {
            const btnIndex = value.findIndex(b => v3.eq(b.pos, pos));
            return <TokenKindUndefEditor
                c={pos}
                value={value[btnIndex]?.kind}
                valueCap={kindCount}
                onInput={(newKind => {
                    if (newKind === undefined) {
                        upd({ $splice: [[btnIndex, 1]] });
                    } else if (btnIndex < 0) {
                        upd({ $push: [{ kind: newKind, pos }] });
                    } else {
                        upd({ [btnIndex]: { kind: { $set: newKind } } });
                    }
                })}
            />;
        })}
        ${step.producees.map(token => <circle
            {...cxy(token.pos)}
            className={cx(`produceeToken produceeToken${token.kind}`)}
            pointer-events="none" />)}
        ${step.forces
            .filter(({ vec }) => v3.len(vec) > 0)
            .map(({ target, vec }) => <line
                className={cx("force", "force" + target.kind)}
                {...xy12(v3.sub(target.pos, vec), target.pos)}
                pointer-events="none" />)}
        ${step.consumees.map(token => <circle
            {...cxy(token.pos)}
            className={cx(`consumeeToken consumeeToken${token.kind}`)}
            pointer-events="none" />)}
        ${step.collisions.map(collision => <>
            <text 
                {...xy(collision[0].pos)}
                font-size="0.4px"
                pointer-events="none"
            >. Collision: {JSON.stringify(collision)}</text>
        </>)}
    </svg>;
}
