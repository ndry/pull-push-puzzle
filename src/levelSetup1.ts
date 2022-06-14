import { RuleSet, Space } from "./simulation";
import * as hg from "./utils/hg";


export const levelSetup1 = { 
    ruleSet: { 
        forceRules: [
            { sourceKind: 1, targetKind: 0, radiusKind: 1, directionKind: 2 }, 
            { sourceKind: 1, targetKind: 0, radiusKind: 2, directionKind: 1 }
        ], 
        producerRules: [
            { sourceKind: 2, targetKind: 0 }
        ], 
        consumerRules: [
            { sourceKind: 3, targetKind: 0 }
        ],
    } as RuleSet, 
    initialSpace: [
        { kind: 2, pos: [0, 0, 0] }, 
        { kind: 1, pos: [-2, 0, 2] }, 
        { kind: 1, pos: [-3, -1, 4] }, 
        { kind: 3, pos: [-1, -2, 3] },
    ] as Space,
};

export const levelSetup2 = {
    ruleSet: {
        forceRules: [
            {
                sourceKind: 0,
                targetKind: 1,
                radiusKind: 0,
                directionKind: 0
            },
            {
                sourceKind: 1,
                targetKind: 0,
                radiusKind: 1,
                directionKind: 3
            },
            {
                sourceKind: 1,
                targetKind: 0,
                radiusKind: 2,
                directionKind: 3
            }
        ],
        producerRules: [{
            sourceKind: 2,
            targetKind: 0,
        }],
        consumerRules: [{
            sourceKind: 3,
            targetKind: 0,
        }],
    } as RuleSet,
    initialSpace: [{
        kind: 0,
        pos: hg.axialToCube([1, 3])
    }, {
        kind: 0,
        pos: hg.axialToCube([-5, 3])
    }, {
        kind: 1,
        pos: hg.axialToCube([-1, 3])
    }, {
        kind: 0,
        pos: hg.axialToCube([3, 1])
    }, {
        kind: 0,
        pos: hg.axialToCube([3, -5])
    }, {
        kind: 1,
        pos: hg.axialToCube([3, -1])
    }, {
        kind: 2,
        pos: hg.axialToCube([1, -3])
    }, {
        kind: 1,
        pos: hg.axialToCube([1, -5])
    }, {
        kind: 3,
        pos: hg.axialToCube([3, 0])
    }] as Space,
};
