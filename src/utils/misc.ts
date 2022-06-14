import { v3 } from "./v";
import * as hg from "./hg";

export function* hgCircleDots(radius: number, center: v3 = [0, 0, 0]) {
    if (radius === 0) {
        yield center;
    } else {
        for (let j = 0; j < radius; j++) {
            const ps = [
                [radius, -j] as [number, number],
                [radius - j, -radius] as [number, number],
                [radius - j - 1, j + 1] as [number, number]
            ].map(hg.axialToCube);
            for (const p of ps) {
                yield p;
                yield v3.negate(p);
            }
        }
    }
}

export function* hgDiscDots(radius: number, center: v3 = [0, 0, 0]) {
    for (let i = 0; i < radius; i++) {
        yield* hgCircleDots(i, center);
    }
}
