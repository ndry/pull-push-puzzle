import { useState } from "preact/hooks";
import { css, cx } from "@emotion/css";

const _css = css`
    & {
        background-color: red;
    }
`;

export function Counter() {
    const [count, setCount] = useState(0);

    return <button className={cx("Counter", _css)} onClick={() => setCount(count + 1)}>
        Click me! {count}
    </button>
}