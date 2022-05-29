import { css, cx } from "@emotion/css";
import * as rx from "rxjs";
import * as _ from "lodash";

import { Counter } from "./Counter";
import { useRxSubscribe } from "./react-utils/useRxSubscribe";

export const _css = css`
    & button {
        font-size: 5em;
    }
`;

export function App() {
    return <div className={cx("App", _css)}>
        <div>{useRxSubscribe(() => rx.interval(20).pipe(rx.map(() => new Date().toISOString())), [])}</div>
        <div><Counter /></div>
    </div>
}
