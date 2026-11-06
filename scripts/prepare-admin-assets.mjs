import { copyFile, cp, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.dirname(require.resolve("katex/package.json"));
const destination = path.join(root, "public/admin/vendor/katex");

await mkdir(destination, { recursive: true });
await Promise.all([
	...["katex.min.js", "katex.min.css"].map((name) =>
		copyFile(path.join(source, "dist", name), path.join(destination, name)),
	),
	cp(path.join(source, "dist/fonts"), path.join(destination, "fonts"), {
		recursive: true,
	}),
	copyFile(path.join(source, "LICENSE"), path.join(destination, "LICENSE")),
	copyFile(
		path.join(source, "dist/contrib/mhchem.min.js"),
		path.join(destination, "mhchem.min.js"),
	),
]);
