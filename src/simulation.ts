import * as _ from "lodash";
import * as h from "./utils/hg";
import { v2, v3 } from "./utils/v";

export function getRadiusKind(hexCubeVector: v3) {
    const v = hexCubeVector;
    const l = h.cubeLen(v);
    if (l === 1) {
        return 0;
    }
    if (l === 2) {
        const hasZero = !(v[0] * v[1] * v[2]);
        return hasZero ? 1 : 2;
    }
}

export const getRadiusDirection = [
    (r: v3) => r,
    (r: v3) => v3.scale(r, 1 / 2),
    (r: v3) => v3.scale(v3.add(r, h.cubeRotate60Cv(r)), 1 / 3)
] as const;


export type Button = {
    kind: number,
    pos: v3,
};

export type ForceRule = {
    sourceKind: number,
    targetKind: number,
    radiusKind: number,
    directionKind: number,
}

export type Space = Button[];


export const calcForces = (forceRules: ForceRule[], buttons: Button[]) =>
    buttons.map((target) => ({
        target,
        vec: buttons
            .flatMap((source) => {
                const r = v3.sub(target.pos, source.pos);
                const radiusKind = getRadiusKind(r);
                return forceRules
                    .filter(
                        (f) =>
                            f.sourceKind === source.kind &&
                            f.targetKind === target.kind &&
                            f.radiusKind === radiusKind
                    )
                    .map((f) =>
                        h.cubeRotate60CvTimes(
                            getRadiusDirection[radiusKind!](r),
                            f.directionKind
                        )
                    );
            })
            .reduce((sum, v) => v3.add(sum, v), [0, 0, 0])
    }));

export const simulate = (forceRules: ForceRule[], space: Button[]) => {
    const newSpace = _.cloneDeep(space);
    const forces = calcForces(forceRules, newSpace);
    for (const force of forces) {
        force.target.pos = v3.add(force.target.pos, force.vec);
    }
    return newSpace;
}
