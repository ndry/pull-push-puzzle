import { css, cx } from "@emotion/css";
import * as rx from "rxjs";
import * as _ from "lodash";
import * as it from "./utils/it";
import update from "immutability-helper";
import { calcStep, RuleSet, simulate, Space } from "./simulation";
import { useRxSubscribe } from "./react-utils/useRxSubscribe";
import { useEffect, useState } from "preact/hooks";
import { ForceRuleEditor } from "./ForceRuleEditor";
import { ListEditor, ListEditorStyles } from "./react-utils/ListEditor";
import { SpaceEditor } from "./SpaceEditor";
import { StepPlayer } from "./StepPlayer";
import { pipe, apply } from "./utils/pipe";
import { levelSetup1 } from "./levelSetup1";

const sim = (...args: Parameters<typeof simulate>) =>
    apply(
        it.inf(),
        it.scan(s => simulate(args[0], s), args[1]));

const ensureTime = (spacetime: Space[], t: number, ruleSet: RuleSet) => {
    if (t < spacetime.length) { return spacetime; }

    return [
        ...apply(
            it.concat(spacetime, sim(ruleSet, _.last(spacetime)!)),
            it.take(t + 1)),
    ];
};

const noop = () => undefined;

const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
const _css = css`
    & {
        ${colors.map((color, i) => `--kindColor${i}: ${color};`).join("\n")}
        background-color: #efe;
    }
    &.playing {
        background-color: #eef;
    }
    &>h1 {
        color: #4f4;
        line-height: 1.5em;
    }
    &.playing>h1 {
        color: #44f;
    }
`;



export function App() {
    const colorMap = colors;
    const [ruleSet, setRuleSet] = useState(levelSetup1.ruleSet);
    const [initialSpace, setInitialState] = useState(levelSetup1.initialSpace);

    const [{ spacetime, t }, setState] = useState(() => ({
        spacetime: [initialSpace],
        t: 0,
    }));

    useEffect(() => {
        setState({
            spacetime: [initialSpace],
            t: 0,
        });
    }, [initialSpace, ruleSet]);

    const setT = (t: number) => setState(({ spacetime }) => ({
        spacetime: ensureTime(spacetime, Math.floor(t), ruleSet),
        t,
    }));

    const isEditor = t === 0;
    const space = spacetime[Math.floor(t)];
    const step = calcStep(ruleSet, space);

    const [setupString, setSetupString] = useState(JSON.stringify({
        ruleSet,
        initialSpace,
    }));

    return <div className={cx("App", { playing: !isEditor }, _css)}>
        <h1>{isEditor
            ? <>Editor mode: can edit</>
            : <>Player mode: reset &#x23F9; to edit</>}</h1>
        <ListEditor
            values={ruleSet.forceRules}
            defaultValue={{
                sourceKind: 0,
                targetKind: 1,
                radiusKind: 1,
                directionKind: 0
            }}
            renderValueEditor={(v, onInput) => <ForceRuleEditor
                kindCount={colorMap.length}
                value={v}
                onInput={onInput}
            />}
            onInput={(forceRules) => setRuleSet(ruleSet => update(ruleSet, { forceRules: { $set: forceRules } }))}
            className={ListEditorStyles.boxes} />
        <div>producerRules: {JSON.stringify(ruleSet.producerRules)}</div>
        <div>consumerRules: {JSON.stringify(ruleSet.consumerRules)}</div>
        <StepPlayer value={t} setValue={setT} />
        <SpaceEditor
            kindCount={colorMap.length}
            value={space}
            setValue={isEditor ? setInitialState : noop}
            ruleSet={ruleSet}
            stepFrac={t - Math.trunc(t)} />
        {step.collisions.length > 0 && <div style={{ color: "red" }}>
            Has collisions: {JSON.stringify(step.collisions.map(([{ pos }]) => pos))}
        </div>}
        <button onClick={() => {
            setSetupString(JSON.stringify({
                ruleSet,
                initialSpace,
            }));
        }}>Update setup string</button>
        <input 
            value={setupString}
            onInput={ev => setSetupString(((ev.target) as HTMLInputElement).value)} />
        <button onClick={async () => {
            const setup = JSON.parse(setupString) as typeof levelSetup1;
            setRuleSet(setup.ruleSet);
            setInitialState(setup.initialSpace);
        }}>Parse setup string</button>
        <div>{useRxSubscribe(() => rx.interval(20).pipe(rx.map(() => new Date().toISOString())), [])}</div>
    </div>
}
