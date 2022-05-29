import { useState } from "preact/hooks";
import { css, cx } from '@emotion/css';
type HTMLAttributes<RefType> = import("preact").createElement.JSX.HTMLAttributes<RefType>;

const _css = css`
    & {
        text-decoration: underline dashed;
    }
    &:hover {
        background-color: rgba(255, 221, 0, 0.068);
    }
    & .copied {
        position: relative;
    }
    & .copied>* {
        position: absolute;
        bottom: -1.3em;
        left: 0.1em;
        border: 1px solid;
        background-color: rgb(255, 252, 233);
    }
`;

export function CopySpan({
    data,
    className,
    onMouseDown,
    onDblClick,
    children,
    ...props
}: HTMLAttributes<HTMLSpanElement> & {
    data: string;
}) {
    const [copied, setCopied] = useState(false);

    const copyAndFeedback = async () => {
        await navigator.clipboard.writeText(data);
        setCopied(true);
        setTimeout(() => setCopied(false), 400);
    };

    return <span
        {...props}
        className={cx("CopySpan", _css, className)}
        onMouseDown={function (ev) {
            onMouseDown?.call(this, ev);
            return (ev.detail > 1) && ev.preventDefault(); // prevent text selection on dbl click
        }} 
        onDblClick={function (ev) {
            onDblClick?.call(this, ev);
            return copyAndFeedback();
        }}
        title={"DblClick to copy: " + data}
    >{copied && <span className="copied"><div>Copied!</div></span>}{children}</span>;
}
