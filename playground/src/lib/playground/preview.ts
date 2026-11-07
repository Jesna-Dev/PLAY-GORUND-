/**
 * Builds the document for the live preview iframe. The iframe is sandboxed
 * without allow-same-origin, so this page's code can't reach the app.
 *
 * A small bridge script forwards console output and errors to the app.
 */
const BRIDGE = `<script>(function(){
var send=function(level,text,line){try{parent.postMessage({source:"pg-preview",level:level,text:text,line:line},"*")}catch(e){}};
var fmt=function(v,d){d=d||0;var t=typeof v;if(t==="string")return d?JSON.stringify(v):v;if(v===null||t!=="object"&&t!=="function")return String(v);if(t==="function")return"[Function"+(v.name?": "+v.name:"")+"]";if(v instanceof Error)return v.name+": "+v.message;if(typeof Node!=="undefined"&&v instanceof Node)return v.nodeType===1?"<"+v.tagName.toLowerCase()+(v.id?"#"+v.id:"")+">":v.nodeName;if(d>2)return Array.isArray(v)?"[Array]":"[Object]";try{if(Array.isArray(v))return"["+v.slice(0,100).map(function(x){return fmt(x,d+1)}).join(", ")+"]";var k=Object.keys(v);if(!k.length)return"{}";return"{ "+k.slice(0,50).map(function(x){return x+": "+fmt(v[x],d+1)}).join(", ")+" }"}catch(e){return String(v)}};
["log","info","warn","error","debug"].forEach(function(l){var o=console[l];console[l]=function(){send(l==="debug"?"log":l,[].map.call(arguments,function(a){return fmt(a)}).join(" "));if(o)o.apply(console,arguments)}});
addEventListener("error",function(e){send("error",e.message,e.lineno)});
addEventListener("unhandledrejection",function(e){var r=e.reason;send("error","Uncaught (in promise) "+(r&&r.name?r.name+": "+r.message:fmt(r)))});
})()</script>`;

export type PreviewDocument = {
  html: string;
  /** Document line where script.js line 1 starts, for mapping error lines. */
  scriptStartLine: number;
  scriptLineCount: number;
};

export function buildPreviewDocument(html: string, css: string, js: string): PreviewDocument {
  const head =
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    BRIDGE +
    `<style>\n${css}\n</style>`;

  let doc: string;
  if (/<html[\s>]/i.test(html)) {
    // A full document: put our head content first in <head>.
    doc = /<head[^>]*>/i.test(html)
      ? html.replace(/<head[^>]*>/i, (m) => m + head)
      : html.replace(/<html[^>]*>/i, (m) => `${m}<head>${head}</head>`);
  } else {
    doc = `<!doctype html><html><head>${head}</head><body>\n${html}\n</body></html>`;
  }

  const bodyClose = doc.search(/<\/body>/i);
  const insertAt = bodyClose === -1 ? doc.length : bodyClose;
  const before = `${doc.slice(0, insertAt)}<script>\n`;
  const safeJs = js.replace(/<\/script/gi, "<\\/script");

  return {
    html: `${before}${safeJs}\n</script>${doc.slice(insertAt)}`,
    scriptStartLine: before.split("\n").length,
    scriptLineCount: js.split("\n").length,
  };
}

/** Maps a preview document line to a script.js line, if it falls inside it. */
export function toScriptLine(doc: PreviewDocument, documentLine?: number) {
  if (!documentLine) return undefined;
  const line = documentLine - doc.scriptStartLine + 1;
  return line >= 1 && line <= doc.scriptLineCount ? line : undefined;
}
