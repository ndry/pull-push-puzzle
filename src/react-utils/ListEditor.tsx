import { css, cx } from "@emotion/css";
import update from "immutability-helper";
export type Element = import("preact").JSX.Element;

export const ListEditorStyles = {
    boxes: css`
        & {
            display: flex;
            flex-wrap: wrap;
        }
        & .listEditorEntry {
            position: relative;
        }
        & .listEditorRemoveButton {
            position: absolute;
            top: 2px;
            right: 2px;
        }
        & .listEditorAddButton {
            padding: 30px;
        }
    `,
}



export function ListEditor<T>({
    values, defaultValue, renderValueEditor, onInput, className,
}: {
    values: T[];
    defaultValue: T;
    renderValueEditor: (value: T, onInput: (value: T) => unknown) => Element;
    onInput: (values: T[]) => unknown;
    className?: string;
}) {
    const upd = (x: Parameters<typeof update<typeof values>>[1]) => onInput(update(values, x));
    return <div className={cx("ListEditor", className)}>
        {values.map((v, i) => <div className="listEditorEntry">
            {renderValueEditor(v, (_0) => upd({ [i]: { $set: _0 } }))}
            <button className="listEditorRemoveButton" onClick={() => upd({ $splice: [[i, 1]] })}>&times;</button>
        </div>)}
        <button className="listEditorAddButton" onClick={() => upd({ $push: [defaultValue] })}>+</button>
    </div>;
}
