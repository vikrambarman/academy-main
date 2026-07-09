"use client";

/**
 * NoteIframeRenderer.tsx
 * Student aur Teacher side pe HTML notes render karta hai
 * Sandboxed iframe mein — safe rendering
 * Code blocks mein auto Copy button inject karta hai
 */

import { useEffect, useState, useRef } from "react";

interface Props {
    content:     string;
    contentType: "markdown" | "html";
    globalCss?:  string;
}

// Copy button inject karne wala script
const COPY_SCRIPT = `
<script>
(function() {
    // Sabhi pre > code blocks ko find karo
    var blocks = document.querySelectorAll('pre');
    blocks.forEach(function(pre) {
        // Wrapper
        var wrap = document.createElement('div');
        wrap.style.cssText = 'position:relative;margin:0;';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        // Copy button
        var btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.style.cssText = [
            'position:absolute',
            'top:8px',
            'right:8px',
            'padding:3px 10px',
            'border-radius:5px',
            'border:1px solid rgba(255,255,255,0.15)',
            'background:rgba(255,255,255,0.08)',
            'color:#94a3b8',
            'font-size:11px',
            'font-weight:600',
            'cursor:pointer',
            'font-family:Plus Jakarta Sans,sans-serif',
            'transition:all 0.15s',
            'z-index:10',
        ].join(';');

        btn.onmouseenter = function() {
            btn.style.background = 'rgba(255,255,255,0.15)';
            btn.style.color = '#e2e8f0';
        };
        btn.onmouseleave = function() {
            btn.style.background = 'rgba(255,255,255,0.08)';
            btn.style.color = '#94a3b8';
        };

        btn.onclick = function() {
            var code = pre.querySelector('code');
            var text = code ? code.innerText : pre.innerText;
            navigator.clipboard.writeText(text).then(function() {
                btn.textContent = 'Copied!';
                btn.style.color = '#4ade80';
                btn.style.borderColor = 'rgba(74,222,128,0.3)';
                setTimeout(function() {
                    btn.textContent = 'Copy';
                    btn.style.color = '#94a3b8';
                    btn.style.borderColor = 'rgba(255,255,255,0.15)';
                }, 2000);
            }).catch(function() {
                // Fallback
                var ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                btn.textContent = 'Copied!';
                setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
            });
        };

        wrap.appendChild(btn);
    });
})();
</script>
`;

// Highlight.js CDN inject karo code syntax ke liye
const HIGHLIGHT_SCRIPT = `
<link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('pre code').forEach(function(block) {
            hljs.highlightElement(block);
        });
    });
</script>
`;

function buildIframeSrc(html: string, globalCss: string): string {
    let fullHtml = html;

    // Agar sirf partial HTML hai (no doctype/html tag)
    if (!html.trim().toLowerCase().startsWith("<!doctype") &&
        !html.trim().toLowerCase().startsWith("<html")) {
        fullHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${html}
</body>
</html>`;
    }

    // Global CSS + highlight + copy script inject karo
    const injection = `
<style id="__global_notes_css__">
${globalCss}
</style>
${HIGHLIGHT_SCRIPT}
`;

    // </head> ke pehle inject karo
    if (fullHtml.includes("</head>")) {
        fullHtml = fullHtml.replace("</head>", `${injection}\n</head>`);
    } else if (fullHtml.includes("<body")) {
        fullHtml = fullHtml.replace("<body", `${injection}\n<body`);
    } else {
        fullHtml = injection + fullHtml;
    }

    // Copy script </body> ke pehle inject karo
    if (fullHtml.includes("</body>")) {
        fullHtml = fullHtml.replace("</body>", `${COPY_SCRIPT}\n</body>`);
    } else {
        fullHtml = fullHtml + COPY_SCRIPT;
    }

    return "data:text/html;charset=utf-8," + encodeURIComponent(fullHtml);
}

export default function NoteIframeRenderer({ content, contentType, globalCss = "" }: Props) {
    const iframeRef  = useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = useState(600);
    const [loading, setLoading] = useState(true);

    // Iframe height auto-adjust
    const handleLoad = () => {
        setLoading(false);
        try {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const body = iframe.contentDocument?.body;
            if (!body) return;
            // Thoda extra space
            const h = body.scrollHeight + 40;
            setHeight(Math.max(400, h));
        } catch {
            // Cross-origin ya data URI issue — fixed height
            setHeight(600);
        }
    };

    // Content change hone pe height reset
    useEffect(() => {
        setLoading(true);
        setHeight(600);
    }, [content]);

    // Markdown notes — existing NoteRenderer use karo (import se)
    // Yahan sirf HTML handle karenge
    if (contentType !== "html") return null;

    const src = buildIframeSrc(content, globalCss);

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {/* Loading overlay */}
            {loading && (
                <div style={{
                    position:        "absolute",
                    inset:           0,
                    background:      "var(--sp-surface, #1e293b)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    zIndex:          10,
                    borderRadius:    8,
                    gap:             8,
                    fontSize:        12,
                    color:           "var(--sp-muted, #94a3b8)",
                    fontFamily:      "'Plus Jakarta Sans', sans-serif",
                    minHeight:       200,
                }}>
                    <div style={{
                        width:           16,
                        height:          16,
                        border:          "2px solid var(--sp-border, #334155)",
                        borderTopColor:  "var(--sp-accent, #6366f1)",
                        borderRadius:    "50%",
                        animation:       "nirSpin .7s linear infinite",
                    }}/>
                    Note load ho raha hai…
                    <style>{`@keyframes nirSpin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            <iframe
                ref={iframeRef}
                src={src}
                onLoad={handleLoad}
                sandbox="allow-scripts allow-same-origin"
                style={{
                    width:        "100%",
                    height:       height,
                    border:       "none",
                    borderRadius: 8,
                    display:      "block",
                    opacity:      loading ? 0 : 1,
                    transition:   "opacity .2s ease",
                    background:   "#fff",
                }}
                title="Note Content"
            />
        </div>
    );
}