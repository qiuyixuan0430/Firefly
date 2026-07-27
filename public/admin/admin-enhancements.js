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
		label: "高级文字（颜色 / 字体 / 字号）",
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

	window.CMS.registerPreviewStyle("./preview.css");
	window.CMS.init();
})();
