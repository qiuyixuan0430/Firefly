(() => {
	function valueOf(data, name, fallback = "") {
		const value =
			typeof data?.get === "function" ? data.get(name) : data?.[name];
		return String(value ?? fallback);
	}

	function escapeHtml(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}

	function formulaPreview(data, displayMode) {
		const tex = valueOf(data, "tex");
		const tag = displayMode ? "div" : "span";
		const className = "firefly-formula-preview";
		// The bundled CMS mounts React previews; plain DOM nodes are discarded.
		// Use its own React factory so the preview also works inside the iframe.
		if (!tex.trim()) {
			return window.h(
				tag,
				{ className },
				"在公式组件中输入 LaTeX，预览会自动更新。",
			);
		}
		if (!window.katex) {
			return window.h(tag, { className }, tex);
		}
		try {
			const html = window.katex.renderToString(tex, {
				displayMode,
				throwOnError: true,
				trust: false,
				maxExpand: 1000,
				maxSize: 20,
			});
			return window.h(tag, {
				className,
				// Only KaTeX output with trust:false is inserted as HTML.
				dangerouslySetInnerHTML: { __html: html },
			});
		} catch (error) {
			return window.h(
				tag,
				{ className: `${className} firefly-formula-error` },
				`公式语法有误：${error.message}`,
			);
		}
	}

	window.CMS.registerEditorComponent({
		id: "math-block",
		label: "独立公式",
		icon: "functions",
		pattern: /^\$\$[ \t]*\r?\n([\s\S]*?)\r?\n\$\$[ \t]*$/m,
		fields: [
			{
				name: "tex",
				label: "LaTeX 公式",
				widget: "text",
				default: String.raw`\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
				hint: "单独占一行并居中显示。直接填写 LaTeX，不需要输入两侧的 $$；右侧可实时预览。",
			},
		],
		fromBlock: (match) => ({ tex: match[1] }),
		toBlock: (data) => `$$\n${valueOf(data, "tex")}\n$$`,
		toPreview: (data) => formulaPreview(data, true),
	});

	window.CMS.registerEditorComponent({
		id: "math-inline",
		label: "行内公式",
		icon: "calculate",
		mode: "dialog",
		summary: "{{tex}}",
		// Match a single dollar pair, without consuming escaped dollars or $$ blocks.
		pattern: /(?<![\\$])\$(?!\$)((?:\\[^\r\n]|[^$\\\r\n])+?)\$(?!\$)/,
		fields: [
			{
				name: "tex",
				label: "LaTeX 公式",
				widget: "string",
				default: "E = mc^2",
				hint: "嵌在正文中显示，例如 E = mc^2。无需输入两侧的 $。",
			},
		],
		fromBlock: (match) => ({ tex: match[1] }),
		toBlock: (data) =>
			`$${valueOf(data, "tex", "E = mc^2").replaceAll(/\r?\n/g, " ")}$`,
		toPreview: (data) => formulaPreview(data, false),
	});

	const alignments = new Set(["left", "center", "right"]);
	function imageSource(value) {
		const source = String(value).trim();
		// Images may use repository paths or HTTP(S) URLs, never executable schemes.
		try {
			const url = new URL(source, "https://blog.invalid/");
			return ["https:", "http:"].includes(url.protocol) ? source : "";
		} catch {
			return "";
		}
	}

	function alignedImage(data) {
		const requestedAlignment = valueOf(data, "align", "center");
		const align = alignments.has(requestedAlignment)
			? requestedAlignment
			: "center";
		const src = escapeHtml(imageSource(valueOf(data, "src")));
		const alt = escapeHtml(valueOf(data, "alt"));
		const title = escapeHtml(valueOf(data, "title"));
		const caption = escapeHtml(valueOf(data, "caption"));
		return `<figure class="firefly-aligned-image" data-align="${align}"><img src="${src}" alt="${alt}" title="${title}" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
	}

	window.CMS.registerEditorComponent({
		id: "aligned-image",
		label: "图片排版（可居中）",
		icon: "align_horizontal_center",
		// The multiline flag makes this a block component in the bundled CMS.
		pattern:
			/^<figure class="firefly-aligned-image" data-align="(?:left|center|right)"><img [^>]*\/>(?:<figcaption>[\s\S]*?<\/figcaption>)?<\/figure>$/m,
		fields: [
			{
				name: "src",
				label: "图片",
				widget: "image",
				choose_url: true,
				hint: "上传、从媒体库选择，或粘贴图片地址。已有图片可复制原地址到这里。",
			},
			{
				name: "align",
				label: "图片对齐",
				widget: "select",
				default: "center",
				options: [
					{ label: "居中", value: "center" },
					{ label: "左对齐", value: "left" },
					{ label: "右对齐", value: "right" },
				],
			},
			{ name: "alt", label: "替代文本", widget: "string", required: false },
			{ name: "title", label: "悬停提示", widget: "string", required: false },
			{ name: "caption", label: "图片说明", widget: "string", required: false },
		],
		fromBlock(match) {
			const figure = new DOMParser()
				.parseFromString(match[0], "text/html")
				.querySelector("figure");
			const image = figure.querySelector("img");
			return {
				align: figure.dataset.align,
				src: image.getAttribute("src"),
				alt: image.getAttribute("alt"),
				title: image.getAttribute("title"),
				caption: figure.querySelector("figcaption")?.textContent ?? "",
			};
		},
		toBlock: alignedImage,
		toPreview: alignedImage,
	});
})();
