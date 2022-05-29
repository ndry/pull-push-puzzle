import * as rx from "rxjs";
import { useRxSubscribe } from "./useRxSubscribe";

const s = ["...", "·..", "˙·.", "·˙·", ".·˙", "..·"];
export const waiting$f = (interval = 100) =>
    rx.interval(interval).pipe(rx.map(i => s[i % s.length]));
export const Waiting = ({ interval = 100 }: { interval?: number }) =>
    <>{useRxSubscribe(() => waiting$f(interval), [interval])}</>;

