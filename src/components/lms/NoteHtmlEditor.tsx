"use client";

/**
 * NoteHtmlEditor.tsx
 * Monaco Editor with live preview for HTML notes
 * Admin use karega
 */

import Editor from "@monaco-editor/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Eye, EyeOff, Code2, RefreshCw, Maximize2, Minimize2 } from "lucide-react";

interface Props {
    value:     string;
    onChange:  (val: string) => void;
    globalCss?: string;
}

// Default HTML template jo admin ko dikhe empty note mein
const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>Topic ka Title</h1>

<p>Yahan apna content likho ya paste karo.</p>

<h2>Section 1</h2>
<p>Content...</p>

<h2>Section 2</h2>
<ul>
    <li>Point 1</li>
    <li>Point 2</li>
    <li>Point 3</li>
</ul>

<!-- Code example ke liye: -->
<pre><code>your code here</code></pre>

<!-- Info box ke liye: -->
<div class="info-box">
    <strong>💡 Tip:</strong> Koi important baat
</div>

<!-- Warning box ke liye: -->
<div class="warning-box">
    <strong>⚠️ Note:</strong> Dhyan rakhein
</div>

</body>
</html>`;

export default function NoteHtmlEditor({ value, onChange, globalCss = "" }: Props) {

    const [showPreview,  setShowPreview]  = useState(true);
    const [fullscreen,   setFullscreen]   = useState(false);
    const [previewKey,   setPreviewKey]   = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Pehli baar empty ho toh template daal do
    useEffect(() => {
        if (!value || value.trim() === "") {
            onChange(DEFAULT_TEMPLATE);
        }
    }, []);

    // Iframe src — sandboxed HTML render
    const buildSrc = useCallback((html: string, css: string): string => {
        // Agar pura HTML document hai
        if (html.includes("<!DOCTYPE") || html.includes("<html")) {
            // Global CSS inject karo <head> mein
            const withCss = html.replace(
                "</head>",
                `<style id="__global_notes_css__">${css}</style>\n</head>`
            );
            return "data:text/html;charset=utf-8," + encodeURIComponent(withCss);
        }

        // Sirf body content hai — wrap karo
        const fullHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;
        return "data:text/html;charset=utf-8," + encodeURIComponent(fullHtml);
    }, []);

    const refreshPreview = () => setPreviewKey(k => k + 1);

    return (
        <>
            <style>{editorStyles}</style>
            <div className={`nhe-shell ${fullscreen ? "nhe-fullscreen" : ""}`}>

                {/* ── Toolbar ── */}
                <div className="nhe-toolbar">
                    <div className="nhe-tb-left">
                        <div className="nhe-tb-badge">
                            <Code2 size={11}/>
                            HTML Editor
                        </div>
                        <span className="nhe-tb-hint">
                            Full HTML page likho ya kisi bhi website se paste karo
                        </span>
                    </div>
                    <div className="nhe-tb-right">
                        <button
                            type="button"
                            className="nhe-btn"
                            onClick={refreshPreview}
                            title="Preview refresh karo"
                        >
                            <RefreshCw size={11}/>
                        </button>
                        <button
                            type="button"
                            className={`nhe-btn ${showPreview ? "active" : ""}`}
                            onClick={() => setShowPreview(o => !o)}
                            title={showPreview ? "Preview hide karo" : "Preview dikhao"}
                        >
                            {showPreview ? <Eye size={11}/> : <EyeOff size={11}/>}
                            <span>Preview</span>
                        </button>
                        <button
                            type="button"
                            className="nhe-btn"
                            onClick={() => setFullscreen(o => !o)}
                            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                        >
                            {fullscreen ? <Minimize2 size={11}/> : <Maximize2 size={11}/>}
                        </button>
                    </div>
                </div>

                {/* ── Split Pane ── */}
                <div className="nhe-panes">

                    {/* Editor pane */}
                    <div
                        className="nhe-editor-pane"
                        style={{ width: showPreview ? "50%" : "100%" }}
                    >
                        <div className="nhe-pane-head">
                            <span>📝 HTML Code</span>
                            <button
                                type="button"
                                className="nhe-mini-btn"
                                onClick={() => onChange(DEFAULT_TEMPLATE)}
                                title="Template se shuru karo"
                            >
                                Template Load
                            </button>
                        </div>
                        <Editor
                            height="100%"
                            defaultLanguage="html"
                            value={value}
                            onChange={v => onChange(v || "")}
                            theme="vs-dark"
                            options={{
                                fontSize:           13,
                                fontFamily:         "'JetBrains Mono', 'Fira Code', monospace",
                                minimap:            { enabled: false },
                                wordWrap:           "on",
                                lineNumbers:        "on",
                                scrollBeyondLastLine: false,
                                automaticLayout:    true,
                                tabSize:            2,
                                formatOnPaste:      true,
                                formatOnType:       false,
                                suggestOnTriggerCharacters: true,
                                quickSuggestions:   true,
                                padding:            { top: 12, bottom: 12 },
                                renderLineHighlight: "line",
                                smoothScrolling:    true,
                                cursorBlinking:     "smooth",
                                bracketPairColorization: { enabled: true },
                                guides: { bracketPairs: true },
                            }}
                            loading={
                                <div style={{
                                    height:          "100%",
                                    display:         "flex",
                                    alignItems:      "center",
                                    justifyContent:  "center",
                                    background:      "#1e1e1e",
                                    color:           "#6b7280",
                                    fontSize:        13,
                                    fontFamily:      "'Plus Jakarta Sans', sans-serif",
                                    gap:             8,
                                }}>
                                    <div style={{
                                        width:           16,
                                        height:          16,
                                        border:          "2px solid #374151",
                                        borderTopColor:  "#6366f1",
                                        borderRadius:    "50%",
                                        animation:       "nheSpin .7s linear infinite",
                                    }}/>
                                    Editor load ho raha hai…
                                </div>
                            }
                        />
                    </div>

                    {/* Preview pane */}
                    {showPreview && (
                        <div className="nhe-preview-pane">
                            <div className="nhe-pane-head">
                                <span>👁️ Live Preview</span>
                                <span className="nhe-pane-hint">
                                    Global CSS applied
                                </span>
                            </div>
                            <iframe
                                key={previewKey}
                                ref={iframeRef}
                                src={buildSrc(value, globalCss)}
                                sandbox="allow-scripts allow-same-origin"
                                style={{
                                    width:   "100%",
                                    height:  "100%",
                                    border:  "none",
                                    background: "#fff",
                                }}
                                title="Note Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const editorStyles = `
@keyframes nheSpin { to { transform: rotate(360deg); } }

.nhe-shell {
    border: 1px solid var(--cp-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 600px;
    background: #1e1e1e;
}

.nhe-fullscreen {
    position: fixed !important;
    inset: 0 !important;
    z-index: 9999 !important;
    border-radius: 0 !important;
    height: 100vh !important;
}

/* Toolbar */
.nhe-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--cp-surface);
    border-bottom: 1px solid var(--cp-border);
    flex-shrink: 0;
    gap: 12px;
    flex-wrap: wrap;
}
.nhe-tb-left  { display: flex; align-items: center; gap: 10px; }
.nhe-tb-right { display: flex; align-items: center; gap: 6px; }

.nhe-tb-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 100px;
    background: var(--cp-accent-glow);
    color: var(--cp-accent);
    border: 1px solid var(--cp-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: .04em;
    text-transform: uppercase;
}
.nhe-tb-hint {
    font-size: 10px;
    color: var(--cp-muted);
    font-family: 'Plus Jakarta Sans', sans-serif;
}
@media (max-width: 600px) { .nhe-tb-hint { display: none; } }

.nhe-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 7px;
    border: 1px solid var(--cp-border);
    background: var(--cp-surface2);
    color: var(--cp-muted);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .13s;
    white-space: nowrap;
}
.nhe-btn:hover  { border-color: var(--cp-accent); color: var(--cp-accent); background: var(--cp-accent-glow); }
.nhe-btn.active { border-color: var(--cp-accent); color: var(--cp-accent); background: var(--cp-accent-glow); }

/* Split panes */
.nhe-panes {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.nhe-editor-pane {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--cp-border);
    transition: width .2s ease;
    overflow: hidden;
    flex-shrink: 0;
}

.nhe-preview-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
}

.nhe-pane-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: #2d2d2d;
    border-bottom: 1px solid #3a3a3a;
    font-size: 10px;
    font-weight: 600;
    color: #9ca3af;
    font-family: 'Plus Jakarta Sans', sans-serif;
    flex-shrink: 0;
}
.nhe-preview-pane .nhe-pane-head {
    background: var(--cp-surface2);
    border-bottom: 1px solid var(--cp-border);
    color: var(--cp-muted);
}

.nhe-pane-hint {
    font-size: 9px;
    font-weight: 400;
    color: #6b7280;
}

.nhe-mini-btn {
    font-size: 9px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid #4b5563;
    background: #374151;
    color: #9ca3af;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .12s;
}
.nhe-mini-btn:hover { border-color: #6366f1; color: #a5b4fc; }

@media (max-width: 768px) {
    .nhe-editor-pane { width: 100% !important; }
    .nhe-preview-pane { display: none; }
}
`;