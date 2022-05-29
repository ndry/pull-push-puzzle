import { useEffect, useState, Inputs } from "preact/hooks";


export function useToggle(inputs?: Inputs) {
    const [toggle, setToggle] = useState(false);
    useEffect(() => setToggle(toggle => !toggle), inputs);
    return [toggle, setToggle] as const;
}
