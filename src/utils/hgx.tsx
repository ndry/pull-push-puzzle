import * as hg from "./hg";
import { v2, v3 } from "./v";

export const cxy = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return {cx: x, cy: y};
}

export const xy = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return {x: x, y: y};
}

export const xy1 = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return {x1: x, y1: y};
}

export const xy2 = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return {x2: x, y2: y};
}

export const xy12 = (v1: v2 | v3, v2: v2 | v3) => {
    return {...xy1(v1), ...xy2(v2)};
}
