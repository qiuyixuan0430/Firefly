import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeFigure from "../src/plugins/rehype-figure.mjs";

const components = new Map();
const cmsElement = Symbol("CMS React element");
vm.runInNewContext(
	readFileSync(
		new URL("../public/admin/editor-components.js", import.meta.url),
		"utf8",
	),
	{
		window: {
			katex,
			h: (type, props, ...children) => ({ cmsElement, type, props, children }),
			CMS: {
				registerEditorComponent: (component) =>
					components.set(component.id, component),
			},
		},
		URL,
	},
);
const block = components.get("math-block");
const inline = components.get("math-inline");
const image = components.get("aligned-image");
const processor = await createMarkdownProcessor({
	remarkPlugins: [remarkMath],
	rehypePlugins: [[rehypeKatex, { katex }], rehypeFigure],
});

test("formula previews use the CMS React factory accepted by the preview pane", () => {
	for (const [component, type] of [
		[inline, "span"],
		[block, "div"],
	]) {
		const preview = component.toPreview({ tex: String.raw`\sqrt{E_b}` });
		assert.equal(preview.cmsElement, cmsElement);
		assert.equal(preview.type, type);
		assert.match(preview.props.dangerouslySetInnerHTML.__html, /class="katex"/);
		assert.match(preview.props.dangerouslySetInnerHTML.__html, /<math\b/);
	}
});

test("preview keeps error messages as text and preserves literal dollars", () => {
	const error = inline.toPreview({ tex: String.raw`\invalidcommand` });
	assert.match(error.props.className, /firefly-formula-error/);
	assert.equal(error.props.dangerouslySetInnerHTML, undefined);
	assert.match(error.children[0], /公式语法有误/);
	const dollars = inline.toPreview({ tex: String.raw`\text{\$5}` });
	assert.match(dollars.props.dangerouslySetInnerHTML.__html, /class="katex"/);
	const unsafe = inline.toPreview({
		tex: String.raw`\href{javascript:alert(1)}{x}`,
	});
	assert.doesNotMatch(
		unsafe.props.dangerouslySetInnerHTML.__html,
		/<a\b|href=/,
	);
});

test("multiline equations retain LaTeX when saved and reopened", async () => {
	const tex = String.raw`\begin{aligned}
a &= \frac{1}{2} \\
b &= \sqrt{x^2 + y^2}
\end{aligned}`;
	const markdown = block.toBlock({ tex });
	assert.equal(block.fromBlock(markdown.match(block.pattern)).tex, tex);
	assert.equal(inline.pattern.test(markdown), false);
	const html = (await processor.render(markdown)).code;
	assert.match(html, /class="katex-display"/);
	assert.doesNotMatch(html, /katex-error/);
});

test("inline equations stay in the paragraph and support multiple expressions", async () => {
	const markdown = `能量 ${inline.toBlock({ tex: "E = mc^2" })}，以及 ${inline.toBlock({ tex: String.raw`\frac{a}{b}` })}。`;
	const matches = [
		...markdown.matchAll(new RegExp(inline.pattern.source, "g")),
	];
	assert.equal(matches.length, 2);
	assert.equal(inline.fromBlock(matches[0]).tex, "E = mc^2");
	const html = (await processor.render(markdown)).code;
	assert.match(html, /^<p>能量 /);
	assert.doesNotMatch(html, /katex-display/);
	assert.equal(inline.pattern.test(String.raw`价格 \$20`), false);
});

test("chemical formulas use the same extension as the blog", async () => {
	const html = (
		await processor.render(block.toBlock({ tex: String.raw`\ce{H2O}` }))
	).code;
	assert.match(html, /class="katex-display"/);
	assert.doesNotMatch(html, /katex-error/);
});

test("image alignment survives Markdown rendering with escaped attributes", async () => {
	for (const align of ["left", "center", "right"]) {
		const markdown = image.toBlock({
			src: "/uploads/示例.png?a=1&b=2",
			alt: '测试 "图片"',
			caption: "<说明>",
			align,
		});
		assert.match(markdown, image.pattern);
		const html = (await processor.render(markdown)).code;
		assert.match(html, new RegExp(`data-align="${align}"`));
		assert.match(html, /(?:&lt;|&#x3C;)说明(?:&gt;|>)/);
		assert.equal((html.match(/<figure\b/g) ?? []).length, 1);
		assert.equal((html.match(/<figcaption>/g) ?? []).length, 1);
	}
	assert.match(image.toBlock({ src: "/uploads/a.png" }), /data-align="center"/);
});

test("unsafe image URLs and markup cannot become executable HTML", () => {
	for (const src of [
		"javascript:alert(1)",
		"data:text/html,<script>alert(1)</script>",
		"vbscript:msgbox(1)",
	]) {
		assert.match(image.toBlock({ src }), /src=""/);
	}
	const html = image.toBlock({
		src: '/a.png" onerror="alert(1)',
		alt: "<script>alert(1)</script>",
		align: 'center" onclick="alert(1)',
	});
	assert.doesNotMatch(html, /<script>|" onerror=|" onclick=/);
});

test("the figure plugin preserves explicit alignment and separate captions", () => {
	const photo = {
		type: "element",
		tagName: "img",
		properties: { src: "/uploads/a.png", alt: "替代文本" },
		children: [],
	};
	const figure = {
		type: "element",
		tagName: "figure",
		properties: { className: ["firefly-aligned-image"], dataAlign: "right" },
		children: [photo],
	};
	rehypeFigure()({ type: "root", children: [figure] });
	assert.equal(figure.children[0].tagName, "img");
	assert.equal(figure.children.length, 1);
});
