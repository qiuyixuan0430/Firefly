import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const bundlePath = path.join(projectRoot, "public", "admin", "sveltia-cms.js");
const marker = "/* firefly-inline-formatting */";
const inlineBridgeV1 =
	"s=zH(a),c=[];r||(window.__fireflyApplyInlineStyle=t=>s.update(()=>{let e=KV();if(!SV(e))return;let n=e=>{let n={};for(let r of e.split(`;`)){let[e,...t]=r.split(`:`);e&&t.length&&(n[e.trim()]=t.join(`:`).trim())}for(let[e,r]of Object.entries(t))r==null?delete n[e]:n[e]=r;return Object.entries(n).map(([e,t])=>e+`: `+t).join(`; `)};if(e.isCollapsed())return void e.setStyle(n(e.style||``));let r=e.isBackward()?e.focus:e.anchor,i=e.isBackward()?e.anchor:e.focus,a=r.getNode(),o=i.getNode();for(let t of e.getNodes())if(mV(t)){let e=t.getTextContentSize(),s=t.is(a)?r.offset:0,c=t.is(o)?i.offset:e;if(s===c)continue;let l=t;s>0&&c<e?l=t.splitText(s,c)[1]:s>0?l=t.splitText(s)[1]:c<e&&(l=t.splitText(c)[0]),l.setStyle(n(l.getStyle()))}}),window.__fireflyClearInlineStyle=()=>window.__fireflyApplyInlineStyle({color:null,backgroundColor:null,fontFamily:null,fontSize:null}));let l=e=>";
const inlineBridgeV2 =
	's=zH(a),c=[];if(!r){let ffs=null;window.__fireflyRememberInlineSelection=()=>s.getEditorState().read(()=>{let e=KV();SV(e)&&(ffs=e.clone())}),window.__fireflyApplyInlineStyle=t=>s.update(()=>{let e=KV();if(!SV(e)&&ffs&&(pU(ffs),e=KV()),!SV(e))return;let n=e=>{let n={};for(let r of e.split(`;`)){let[e,...t]=r.split(`:`);e&&t.length&&(n[e.trim()]=t.join(`:`).trim())}for(let[e,r]of Object.entries(t))r==null?delete n[e]:n[e]=r;return Object.entries(n).map(([e,t])=>e+`: `+t).join(`; `)};if(e.isCollapsed())return void e.setStyle(n(e.style||``));let r=e.isBackward()?e.focus:e.anchor,i=e.isBackward()?e.anchor:e.focus,a=r.getNode(),o=i.getNode();for(let t of e.getNodes())if(mV(t)){let e=t.getTextContentSize(),s=t.is(a)?r.offset:0,c=t.is(o)?i.offset:e;if(s===c)continue;let l=t;s>0&&c<e?l=t.splitText(s,c)[1]:s>0?l=t.splitText(s)[1]:c<e&&(l=t.splitText(c)[0]),l.setStyle(n(l.getStyle()))}}),window.__fireflyClearInlineStyle=()=>window.__fireflyApplyInlineStyle({color:null,"background-color":null,"font-family":null,"font-size":null})}let l=e=>';
const inlineBridgeV3 = inlineBridgeV2.replace(";if(!r){let ffs=", ";{let ffs=");
const inlineBridgeV4 = inlineBridgeV3
	.replace(
		"s=zH(a),c=[];{let ffs=null;window.__fireflyRememberInlineSelection=",
		"s=zH(a),c=[],ffRemember,ffApply;{let ffs=null;ffRemember=window.__fireflyRememberInlineSelection=",
	)
	.replace(
		",window.__fireflyApplyInlineStyle=t=>",
		",ffApply=window.__fireflyApplyInlineStyle=t=>",
	);
const rootListenerV1 = "l(s.registerRootListener(e=>{if(!e)return;let t=e=>";
const rootListenerV2 =
	"l(s.registerRootListener(e=>{if(!e)return;e.__fireflyRememberInlineSelection=ffRemember,e.__fireflyApplyInlineStyle=ffApply;let t=e=>";
const rootListenerV3 = rootListenerV2.replace(
	";let t=e=>",
	";e.setAttribute(`data-firefly-inline`,`ready`);let t=e=>",
);
const editorFactoryV1 =
	"X1=({enabledButtons:e=[],components:t=[],useMarkdownShortcuts:n,isCodeEditor:r=!1,defaultLanguage:i=`plain`})=>{let a=";
const editorFactoryV2 =
	"X1=({enabledButtons:e=[],components:t=[],useMarkdownShortcuts:n,isCodeEditor:r=!1,defaultLanguage:i=`plain`})=>{window.__fireflyEditorFactoryRuns=(window.__fireflyEditorFactoryRuns||0)+1;let a=";
let source = fs.readFileSync(bundlePath, "utf8");

if (source.includes(marker)) {
	const brokenTransformerList = "r1=[...$,...e1,...t1,...n1]";
	const brokenDeclaration = "Q$,$,e1,t1,n1,r1,ff$,i1=s";
	const transformerWithoutDependencies = "ff$={importRegExp:";
	if (source.includes(brokenTransformerList)) {
		source = source.replace(
			brokenTransformerList,
			() => "r1=[...$$,...e1,...t1,...n1]",
		);
		console.log("Repaired the Sveltia inline transformer list.");
	}
	if (source.includes(inlineBridgeV1)) {
		source = source.replace(inlineBridgeV1, () => inlineBridgeV2);
		console.log("Upgraded inline selection preservation.");
	}
	if (source.includes(inlineBridgeV2)) {
		source = source.replace(inlineBridgeV2, () => inlineBridgeV3);
		console.log("Enabled the inline bridge for the active text editor.");
	}
	if (source.includes(inlineBridgeV3)) {
		source = source.replace(inlineBridgeV3, () => inlineBridgeV4);
		console.log("Bound inline formatting functions to the active editor.");
	}
	if (source.includes(rootListenerV1)) {
		source = source.replace(rootListenerV1, () => rootListenerV2);
		console.log("Attached the inline bridge to the editor root.");
	}
	if (source.includes(rootListenerV2)) {
		source = source.replace(rootListenerV2, () => rootListenerV3);
		console.log("Added the inline editor readiness marker.");
	}
	if (source.includes(editorFactoryV1)) {
		// No debug instrumentation is added in production builds.
	}
	if (source.includes(editorFactoryV2)) {
		source = source.replace(editorFactoryV2, () => editorFactoryV1);
		console.log("Removed the temporary editor initialization marker.");
	}
	if (source.includes(brokenDeclaration)) {
		source = source.replace(
			brokenDeclaration,
			() => "Q$,$$,e1,t1,n1,r1,ff$,i1=s",
		);
		console.log("Repaired the transformer variable declaration.");
	}
	if (source.includes(transformerWithoutDependencies)) {
		source = source.replace(
			transformerWithoutDependencies,
			() => "ff$={dependencies:[],importRegExp:",
		);
		console.log("Added the inline transformer dependency declaration.");
	}
	fs.writeFileSync(bundlePath, source);
	if (!source.includes(inlineBridgeV4) || !source.includes(rootListenerV3)) {
		console.log("Sveltia inline formatting patch is already applied.");
	}
	process.exit(0);
}

function replaceOnce(search, replacement, description) {
	const first = source.indexOf(search);
	const last = source.lastIndexOf(search);
	if (first === -1 || first !== last) {
		throw new Error(
			`Cannot safely patch ${description}: expected exactly one match.`,
		);
	}
	source = source.replace(search, () => replacement);
}

replaceOnce(
	"Q$,$$,e1,t1,n1,r1,i1=s",
	"Q$,$$,e1,t1,n1,r1,ff$,i1=s",
	"transformer declaration",
);

replaceOnce(
	"n1=[Q$],r1=[...$$,...e1,...t1,...n1]",
	'ff$={dependencies:[],importRegExp:/<span style="([^"]*)">([\\s\\S]*?)<\\/span>/,regExp:/<span style="([^"]*)">([\\s\\S]*?)<\\/span>$/,replace:(e,t)=>{let n=pV(QQ(t[2]));return n.setFormat(e.getFormat()),n.setStyle(QQ(t[1])),e.replace(n),n},type:`text-match`},n1=[Q$,ff$],r1=[...$$,...e1,...t1,...n1]',
	"inline style Markdown importer",
);

replaceOnce(
	"return u&&!e.hasFormat(`code`)?p+d:p+s+f+c+m+l}",
	'let v=u&&!e.hasFormat(`code`)?p+d:p+s+f+c+m+l,y=e.getStyle();return y?`<span style="`+y.replace(/&/g,`&#38;`).replace(/"/g,`&#34;`)+`">`+v.replace(/&/g,`&#38;`).replace(/</g,`&#60;`).replace(/>/g,`&#62;`)+`</span>`:v}',
	"inline style Markdown exporter",
);

replaceOnce(
	"o=[...t.map(({transformer:e})=>e),",
	"o=[...(r?[]:[ff$]),...t.map(({transformer:e})=>e),",
	"inline style transformer activation",
);

replaceOnce("s=zH(a),c=[],l=e=>", inlineBridgeV4, "selected text style bridge");

replaceOnce(
	rootListenerV1,
	rootListenerV3,
	"inline formatting editor root binding",
);

source = source.replace(
	"//# sourceMappingURL=sveltia-cms.js.map",
	`${marker}\n//# sourceMappingURL=sveltia-cms.js.map`,
);
fs.writeFileSync(bundlePath, source);
console.log("Patched Sveltia CMS with inline text formatting support.");
