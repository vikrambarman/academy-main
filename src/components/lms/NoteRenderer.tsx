"use client";

/**
 * NoteRenderer.tsx
 * Sirf markdown notes ke liye — purane notes backward compatible
 * HTML notes ke liye NoteIframeRenderer use hoga
 */

import ReactMarkdown   from "react-markdown";
import remarkGfm       from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
    content:      string;
    contentType?: "markdown" | "html";
    className?:   string;
}

export default function NoteRenderer({
    content,
    contentType = "markdown",
    className   = "",
}: Props) {

    // HTML notes yahan render nahi honge
    // NoteIframeRenderer unhe handle karega
    if (contentType === "html") return null;

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ className: cls, children, ...rest }: any) {
                        return (
                            <code className={cls} {...rest}>
                                {children}
                            </code>
                        );
                    },
                    pre({ children }: any) {
                        const copyText = (children as any)?.props?.children;
                        return (
                            <div style={{ position: "relative" }}>
                                <pre>{children}</pre>
                                {typeof copyText === "string" && (
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(copyText)
                                        }
                                        style={{
                                            position:     "absolute",
                                            top:          10,
                                            right:        10,
                                            padding:      "3px 8px",
                                            borderRadius: 6,
                                            background:   "rgba(255,255,255,.1)",
                                            color:        "#94a3b8",
                                            border:       "none",
                                            cursor:       "pointer",
                                            fontSize:     10,
                                            fontWeight:   600,
                                            fontFamily:   "'Plus Jakarta Sans',sans-serif",
                                        }}
                                    >
                                        Copy
                                    </button>
                                )}
                            </div>
                        );
                    },
                    table({ children }: any) {
                        return (
                            <div style={{ overflowX: "auto", margin: "1rem 0" }}>
                                <table>{children}</table>
                            </div>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}