import * as _ from "lodash";
import * as h from "./utils/hg";
import { v2, v3 } from "./utils/v";
import * as it from "./utils/it";
import { pipe, apply } from "./utils/pipe";

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


export type Token = {
    kind: number,
    pos: v3,
};

export type ForceRule = {
    sourceKind: number,
    targetKind: number,
    radiusKind: number,
    directionKind: number,
}

export type ProducerRule = {
    sourceKind: number,
    targetKind: number,
    // interval: number,
    // check: boolean,
}

export type ConsumerRule = {
    sourceKind: number,
    targetKind: number,
    // interval: number,
    // check: boolean,
}

export type RuleSet = {
    forceRules: ForceRule[],
    producerRules: ProducerRule[],
    consumerRules: ConsumerRule[],
}

export type Space = Token[];

export function isRuleAplicable(
    rule: {
        sourceKind: number,
        targetKind: number,
        radiusKind?: number
    },
    source: { kind: number, pos: v3 }, 
    target?: { kind: number, pos: v3 }, 
) {
    if (!target) {
        return rule.sourceKind === source.kind;
    }
    if (rule.sourceKind !== source.kind || rule.targetKind !== target.kind) {
        return false;
    }
    return rule.radiusKind === undefined
        ? v3.eq(target.pos, source.pos)
        : getRadiusKind(v3.sub(target.pos, source.pos)) === rule.radiusKind;
}


export const calcForces = (forceRules: ForceRule[], space: Token[]) =>
    space.map((target) => ({
        target,
        vec: space
            .flatMap((source) => {
                const r = v3.sub(target.pos, source.pos);
                const radiusKind = getRadiusKind(r);
                return forceRules
                    .filter(rule => isRuleAplicable(rule, source, target))
                    .map((f) =>
                        h.cubeRotate60CvTimes(
                            getRadiusDirection[radiusKind!](r),
                            f.directionKind
                        )
                    );
            })
            .reduce((sum, v) => v3.add(sum, v), [0, 0, 0])
    }));

export const calcProducees = (producerRules: ProducerRule[], space: Token[]) =>
    space.flatMap(
        token => producerRules
            .filter(r => r.sourceKind === token.kind)
            .map(r => ({ pos: token.pos, kind: r.targetKind })));

export const calcConsumees = (consumerRules: ConsumerRule[], space: Token[]) =>
    apply(it.zip3(space, space, consumerRules), pipe(
        it.filter(([source, target, rule]) => isRuleAplicable(rule, source, target)),
        it.map(([source, target, rule]) => target),
    ));

export function* forEachPair<T>(arr: T[]) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            yield [arr[i], arr[j]];
        }
    }
}

export const calcStep = (ruleSet: RuleSet, space: Token[]) => {
    const producees = [...calcProducees(ruleSet.producerRules, space)];
    const nextSpace = [...producees, ...space].map(t => _.cloneDeep(t));
    const forces = calcForces(ruleSet.forceRules, nextSpace);
    for (const force of forces) {
        force.target.pos = v3.add(force.target.pos, force.vec);
    }
    const consumees = [...calcConsumees(ruleSet.consumerRules, nextSpace)];
    const nextSpace1 = nextSpace.filter(token => consumees.indexOf(token) < 0);
    const collisions = calcCollisions(nextSpace1);
    return {
        ruleSet,
        space,
        producees,
        nextSpace,
        forces,
        consumees,
        nextSpace1,
        collisions,
    }
}


export const calcCollisions = (space: Token[]) =>
    [...forEachPair(space)].filter(([t1, t2]) => v3.eq(t1.pos, t2.pos));

export const simulate = (ruleSet: RuleSet, space: Token[]) => {
    const newSpace = [
        ...calcProducees(ruleSet.producerRules, space),
        ...space.map(t => _.cloneDeep(t)),
    ];
    const forces = calcForces(ruleSet.forceRules, newSpace);
    for (const force of forces) {
        force.target.pos = v3.add(force.target.pos, force.vec);
    }
    const consumees = [...calcConsumees(ruleSet.consumerRules, newSpace)];
    return newSpace.filter(token => consumees.indexOf(token) < 0);
}


