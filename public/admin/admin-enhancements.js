(() => {
	const FONT_FAMILIES = {
		default: "inherit",
		sans: "PingFang SC, Microsoft YaHei, sans-serif",
		serif: "Noto Serif SC, Songti SC, SimSun, serif",
		kai: "KaiTi, STKaiti, serif",
		mono: "JetBrains Mono, Consolas, monospace",
	};

	const FONT_SIZES = {
		14: "14px",
		16: "16px",
		18: "18px",
		20: "20px",
		24: "24px",
		28: "28px",
		32: "32px",
	};

	const ALIGNMENTS = new Set(["left", "center", "right", "justify"]);

	function getValue(data, key, fallback) {
		const value = typeof data?.get === "function" ? data.get(key) : data?.[key];
		return value === undefined || value === null || value === ""
			? fallback
			: value;
	}

	function escapeHtml(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}

	function decodeHtml(value) {
		const textarea = document.createElement("textarea");
		textarea.innerHTML = String(value).replaceAll(/<br\s*\/?\s*>/gi, "\n");
		return textarea.value;
	}

	function normalizeColor(value, fallback) {
		const color = String(value || "").trim();
		return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
	}

	function normalizeBoolean(value) {
		return value === true || value === "true";
	}

	function createStyledBlock(data) {
		const text = String(getValue(data, "text", "在这里输入文字"));
		const color = normalizeColor(getValue(data, "color", "#334155"), "#334155");
		const highlight = normalizeColor(
			getValue(data, "highlight", "#fff3a3"),
			"#fff3a3",
		);
		const highlighted = normalizeBoolean(getValue(data, "highlighted", false));
		const fontKey = String(getValue(data, "font", "default"));
		const sizeKey = String(getValue(data, "size", "16"));
		const bold = normalizeBoolean(getValue(data, "bold", false));
		const italic = normalizeBoolean(getValue(data, "italic", false));
		const indent = normalizeBoolean(getValue(data, "indent", false));
		const requestedAlignment = String(getValue(data, "align", "left"));
		const alignment = ALIGNMENTS.has(requestedAlignment)
			? requestedAlignment
			: "left";
		const font = FONT_FAMILIES[fontKey] || FONT_FAMILIES.default;
		const size = FONT_SIZES[sizeKey] || FONT_SIZES["16"];
		const styles = [
			`color:${color}`,
			`background-color:${highlighted ? highlight : "transparent"}`,
			`font-family:${font}`,
			`font-size:${size}`,
			`font-weight:${bold ? "700" : "400"}`,
			`font-style:${italic ? "italic" : "normal"}`,
			`text-align:${alignment}`,
			`text-indent:${indent ? "2em" : "0"}`,
		];
		const content = escapeHtml(text).replaceAll("\n", "<br />");

		return `<p class="firefly-word-style" data-color="${color}" data-highlight="${highlight}" data-highlighted="${highlighted}" data-font="${fontKey}" data-size="${sizeKey}" data-bold="${bold}" data-italic="${italic}" data-align="${alignment}" data-indent="${indent}" style="${styles.join(";")}">${content}</p>`;
	}

	window.CMS.registerEditorComponent({
		id: "word-style",
		label: "旧版整段文字格式（不推荐）",
		icon: "format_color_text",
		pattern:
			/^<p class="firefly-word-style" data-color="(#[0-9a-fA-F]{6})" data-highlight="(#[0-9a-fA-F]{6})" data-highlighted="(true|false)" data-font="(default|sans|serif|kai|mono)" data-size="(14|16|18|20|24|28|32)" data-bold="(true|false)" data-italic="(true|false)" data-align="(left|center|right|justify)" data-indent="(true|false)" style="[^"]*">([\s\S]*?)<\/p>$/,
		fields: [
			{
				label: "文字内容",
				name: "text",
				widget: "text",
				required: true,
			},
			{
				label: "字体颜色",
				name: "color",
				widget: "color",
				default: "#334155",
			},
			{
				label: "启用荧光高亮",
				name: "highlighted",
				widget: "boolean",
				default: false,
			},
			{
				label: "荧光颜色",
				name: "highlight",
				widget: "color",
				default: "#fff3a3",
			},
			{
				label: "字体",
				name: "font",
				widget: "select",
				default: "default",
				options: [
					{ label: "跟随博客默认字体", value: "default" },
					{ label: "黑体 / 无衬线", value: "sans" },
					{ label: "宋体 / 衬线", value: "serif" },
					{ label: "楷体", value: "kai" },
					{ label: "等宽字体", value: "mono" },
				],
			},
			{
				label: "字号",
				name: "size",
				widget: "select",
				default: "16",
				options: ["14", "16", "18", "20", "24", "28", "32"],
			},
			{
				label: "粗体",
				name: "bold",
				widget: "boolean",
				default: false,
			},
			{
				label: "斜体",
				name: "italic",
				widget: "boolean",
				default: false,
			},
			{
				label: "对齐方式",
				name: "align",
				widget: "select",
				default: "left",
				options: [
					{ label: "左对齐", value: "left" },
					{ label: "居中", value: "center" },
					{ label: "右对齐", value: "right" },
					{ label: "两端对齐", value: "justify" },
				],
			},
			{
				label: "首行缩进两个字",
				name: "indent",
				widget: "boolean",
				default: false,
			},
		],
		fromBlock(match) {
			return {
				color: match[1],
				highlight: match[2],
				highlighted: match[3] === "true",
				font: match[4],
				size: match[5],
				bold: match[6] === "true",
				italic: match[7] === "true",
				align: match[8],
				indent: match[9] === "true",
				text: decodeHtml(match[10]),
			};
		},
		toBlock: createStyledBlock,
		toPreview: createStyledBlock,
	});

	function applyInlineStyle(root, style) {
		const apply = root.__fireflyApplyInlineStyle;
		if (typeof apply === "function") {
			apply(style);
		}
	}

	function addOption(select, label, value) {
		const option = document.createElement("option");
		option.textContent = label;
		option.value = value;
		select.append(option);
	}

	function createInlineToolbar(root) {
		const group = document.createElement("div");
		group.className = "firefly-inline-tools";
		group.setAttribute("role", "group");
		group.setAttribute("aria-label", "选中文字格式");
		group.addEventListener(
			"mousedown",
			() => root.__fireflyRememberInlineSelection?.(),
			true,
		);

		const colorLabel = document.createElement("label");
		colorLabel.title = "选中文字颜色";
		colorLabel.textContent = "字色";
		const color = document.createElement("input");
		color.type = "color";
		color.value = "#e74c3c";
		color.addEventListener("input", () =>
			applyInlineStyle(root, { color: color.value }),
		);
		colorLabel.append(color);

		const highlightLabel = document.createElement("label");
		highlightLabel.title = "选中文字荧光颜色";
		highlightLabel.textContent = "荧光";
		const highlight = document.createElement("input");
		highlight.type = "color";
		highlight.value = "#fff3a3";
		highlight.addEventListener("input", () =>
			applyInlineStyle(root, { "background-color": highlight.value }),
		);
		highlightLabel.append(highlight);

		const font = document.createElement("select");
		font.title = "选中文字字体";
		font.setAttribute("aria-label", "选中文字字体");
		addOption(font, "字体", "");
		addOption(font, "默认字体", "inherit");
		addOption(font, "黑体", "PingFang SC, Microsoft YaHei, sans-serif");
		addOption(font, "宋体", "Noto Serif SC, Songti SC, SimSun, serif");
		addOption(font, "楷体", "KaiTi, STKaiti, serif");
		addOption(font, "等宽", "JetBrains Mono, Consolas, monospace");
		font.addEventListener("change", () => {
			if (font.value) applyInlineStyle(root, { "font-family": font.value });
			font.selectedIndex = 0;
		});

		const size = document.createElement("select");
		size.title = "选中文字字号";
		size.setAttribute("aria-label", "选中文字字号");
		addOption(size, "字号", "");
		for (const value of ["14", "16", "18", "20", "24", "28", "32"]) {
			addOption(size, value, `${value}px`);
		}
		size.addEventListener("change", () => {
			if (size.value) applyInlineStyle(root, { "font-size": size.value });
			size.selectedIndex = 0;
		});

		const clear = document.createElement("button");
		clear.type = "button";
		clear.className = "firefly-clear-inline";
		clear.textContent = "清除文字样式";
		clear.title = "只清除颜色、荧光、字体和字号";
		clear.addEventListener("mousedown", (event) => event.preventDefault());
		clear.addEventListener("click", () =>
			applyInlineStyle(root, {
				color: null,
				"background-color": null,
				"font-family": null,
				"font-size": null,
			}),
		);

		const indent = document.createElement("button");
		indent.type = "button";
		indent.className = "firefly-first-line-indent";
		indent.textContent = "首行缩进";
		indent.title = "当前段落首行缩进两个汉字；再次点击取消";
		indent.addEventListener("mousedown", (event) => event.preventDefault());
		indent.addEventListener("click", () =>
			root.__fireflyToggleFirstLineIndent?.(),
		);

		group.append(colorLabel, highlightLabel, font, size, clear, indent);
		return group;
	}

	function installInlineToolbars() {
		for (const root of document.querySelectorAll('[contenteditable="true"]')) {
			let container = root.parentElement;
			let toolbar = null;
			for (let depth = 0; container && depth < 6; depth += 1) {
				toolbar = container.querySelector('[role="toolbar"]');
				if (toolbar) break;
				container = container.parentElement;
			}
			if (!toolbar || toolbar.querySelector(".firefly-inline-tools")) continue;
			toolbar.append(createInlineToolbar(root));
		}
	}

	const adminStyle = document.createElement("style");
	adminStyle.textContent = `
		.firefly-inline-tools { display: inline-flex; align-items: center; gap: 5px; padding-inline: 5px; border-inline-start: 1px solid var(--sui-textbox-border-color); }
		.firefly-inline-tools label { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; white-space: nowrap; }
		.firefly-inline-tools input[type="color"] { width: 25px; height: 25px; padding: 1px; border: 0; background: transparent; cursor: pointer; }
		.firefly-inline-tools select { min-width: 62px; height: 30px; border: 1px solid var(--sui-textbox-border-color); border-radius: 5px; background: var(--sui-primary-background-color); color: inherit; }
		.firefly-clear-inline, .firefly-first-line-indent { min-height: 30px; padding: 0 7px; border: 1px solid var(--sui-textbox-border-color); border-radius: 5px; background: transparent; color: inherit; cursor: pointer; }
	`;
	document.head.append(adminStyle);

	const toolbarObserver = new MutationObserver(installInlineToolbars);
	toolbarObserver.observe(document.body, { childList: true, subtree: true });
	installInlineToolbars();

	window.CMS.registerPreviewStyle("./preview.css");
	window.CMS.init();
})();
