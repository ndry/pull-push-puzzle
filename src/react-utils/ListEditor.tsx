import { css, cx } from "@emotion/css";
import { Updater, useSubUpdate } from "./useUpdate";
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
    valuesUpdater: [values, updValues], defaultValue, renderValueEditor, className,
}: {
    valuesUpdater: Updater<T[]>,
    defaultValue: T;
    renderValueEditor: ([value, updValue]: Updater<T>) => Element;
    className?: string;
}) {
    return <div className={cx("ListEditor", className)}>
        {values.map((v, i) => <div className="listEditorEntry">
            {renderValueEditor(useSubUpdate([values, updValues], i))}
            <button 
                className="listEditorRemoveButton" 
                onClick={() => updValues({ $splice: [[i, 1]] })}
            >&times;</button>
        </div>)}
        <button 
            className="listEditorAddButton" 
            onClick={() => updValues({ $push: [defaultValue] })}
        >+</button>
    </div>;
}
