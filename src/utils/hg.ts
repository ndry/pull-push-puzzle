import { v2, v3 } from "./v";

export const SQRT3 = Math.sqrt(3);
export const axialToFlatCart = ([q, r]: v2 | v3) => [(SQRT3 / 2) * q, (1 / 2) * q + r] as v2;
export const axialToCube = ([q, r]: v2) => [q, r, -q - r] as v3;
export const cubeLen = ([q, r, s]: v3) => (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
export const cubeFlatNorth = [0, 1, -1] as v3;
export const cubeRotate60Cv = ([q, r, s]: v3) => [-r, -s, -q] as v3;
export const cubeRotate60CvTimes = (v: v3, times: number) => {
    times %= 6;
    if (times < 0) times += 6;
    for (let i = 0; i < times; i++) v = cubeRotate60Cv(v);
    return v;
};
export const cubeRound = (v: v3) => {
    const { round, abs } = Math;
    const [q, r, s] = v.map(round);

    const q_diff = abs(q - v[0]);
    const r_diff = abs(r - v[1]);
    const s_diff = abs(s - v[2]);

    if (q_diff > r_diff && q_diff > s_diff) return [-r - s, r, s] as v3;
    if (r_diff > s_diff) return [q, -q - s, s] as v3;
    return [q, r, -q - r] as v3;
};
