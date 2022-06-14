import { cx } from "@emotion/css";
import { useState } from "preact/hooks";
import * as rx from "rxjs";
import { useRxSubscribe } from "./react-utils/useRxSubscribe";


export function FramePlayer({
    value: t, setValue: setT,
}: {
    value: number;
    setValue: (value: number) => void;
}) {
    const [isTicking, setIsTicking] = useState(false);
    const autoplayT = useRxSubscribe(() =>
        isTicking
            ? rx.timer(100, 500).pipe(rx.map(i => t + i + 1))
            : rx.from([undefined]), 
        [isTicking]);
    if (isTicking && autoplayT !== undefined && autoplayT !== t) {
        setT(autoplayT);
    }
    return <div className={cx("FramePlayer")}>
        <button onClick={() => { setIsTicking(false); setT(0); }}>&#x23F9;</button>
        <button onClick={() => { setIsTicking(false); setT(Math.max(t - 1, 0)); }}>&#x2759;&#x23F4;</button>
        <button onClick={() => { setIsTicking(!isTicking); }}>{isTicking ? <>&#x23F8;</> : <>&#x25B6;</>}</button>
        <button onClick={() => { setIsTicking(false); setT(t + 1); }}>&#x23F5;&#x2759;</button>
        <span> Step: {t + 1}</span>
    </div>;
}
