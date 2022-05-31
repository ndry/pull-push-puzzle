import { css, cx } from "@emotion/css";
import * as rx from "rxjs";
import * as _ from "lodash";
import * as hg from "./utils/hg";
import { simulate } from "./simulation";
import { useRxSubscribe } from "./react-utils/useRxSubscribe";
import { useState } from "preact/hooks";
import { SimulationPlayer } from "./SimulationPlayer";
import { ForceRuleEditor } from "./ForceRuleEditor";
import { useState1 } from "./react-utils/useState1";
import { ListEditor, ListEditorStyles } from "./react-utils/ListEditor";
import { inf, pipe } from "./utils/misc";
import { SpaceEditor } from "./SpaceEditor";

const _css = css`
`;

export function App() {
    const colorMap = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
    const [forceRules, setForceRules, updForceRules] = useState1([
        {
            sourceKind: 0,
            targetKind: 1,
            radiusKind: 0,
            directionKind: 0
        },
        {
            sourceKind: 1,
            targetKind: 0,
            radiusKind: 1,
            directionKind: 3
        },
        {
            sourceKind: 1,
            targetKind: 0,
            radiusKind: 2,
            directionKind: 3
        }
    ]);


    const [initialSpace, setInitialState] = useState([
        {
            kind: 0,
            pos: hg.axialToCube([1, 3])
        },
        {
            kind: 0,
            pos: hg.axialToCube([-5, 3])
        },
        {
            kind: 1,
            pos: hg.axialToCube([-1, 3])
        },
        {
            kind: 0,
            pos: hg.axialToCube([3, 1])
        },
        {
            kind: 0,
            pos: hg.axialToCube([3, -5])
        },
        {
            kind: 1,
            pos: hg.axialToCube([3, -1])
        }
    ]);

    const spacetime = [
        initialSpace,
        ...pipe(inf(), rx.pipe(
            rx.scan(s => simulate(forceRules, s), initialSpace),
            rx.take(99),
        ))]

    const [list, setList] = useState(["a", "bb", "cdef"]);
    return <div className={cx("App", _css)}>
        {/* <ListEditor
            values={list}
            defaultValue="def"
            renderValueEditor={(v, onInput) => <input
                value={v}
                onInput={ev => onInput((ev.target as HTMLInputElement).value)} />}
            onInput={setList}
        /> */}
        <ListEditor
            values={forceRules}
            defaultValue={{
                sourceKind: 0,
                targetKind: 1,
                radiusKind: 1,
                directionKind: 0
            }}
            renderValueEditor={(v, onInput) => <ForceRuleEditor
                colorMap={colorMap}
                value={v}
                onInput={onInput}
            />}
            onInput={setForceRules}
            className={ListEditorStyles.boxes} />
        <SpaceEditor
            colorMap={colorMap}
            value={initialSpace}
            onInput={setInitialState}
            forceRules={forceRules} />
        <SimulationPlayer spacetime={spacetime} forceRules={forceRules} colorMap={colorMap} />
        <div>{useRxSubscribe(() => rx.interval(20).pipe(rx.map(() => new Date().toISOString())), [])}</div>
    </div>
}



