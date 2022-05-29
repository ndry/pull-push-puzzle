import { css, keyframes } from "@emotion/css";
import { Inputs } from "preact/hooks";
import { useToggle } from "./useToggle";

const flashesKeyframes = [
    keyframes`0% { background: #f6e7fc; } 100% { background: initial; } #`,
    keyframes`0% { background: #f6e7fc; } 100% { background: initial; } ##`,
]
export const flashes = [
    css`& { animation: ${flashesKeyframes[0]} 1s; }`,
    css`& { animation: ${flashesKeyframes[1]} 1s; }`,
];

export const useFlashes = (inputs?: Inputs) => flashes[+useToggle(inputs)[0]];