import * as hg from "./hg";
import { v2, v3 } from "./v";
type HTMLAttributes<RefType> = import("preact").createElement.JSX.HTMLAttributes<RefType>;
type SVGAttributes<RefType> = import("preact").createElement.JSX.SVGAttributes<RefType>;

export function HgCircle({
    c,
    children,
    ...props
}: SVGAttributes<SVGCircleElement> & {
    c: v2 | v3,
}) {
    const [cx, cy] = hg.axialToFlatCart(c);
    return <circle cx={cx} cy={cy} {...props}>{children}</circle>
}

export function HgLine({
    p1,
    p2,
    children,
    ...props
}: SVGAttributes<SVGLineElement> & {
    p1: v2 | v3,
    p2: v2 | v3,
}) {
    const [x1, y1] = hg.axialToFlatCart(p1);
    const [x2, y2] = hg.axialToFlatCart(p2);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props}>{children}</line>
}
