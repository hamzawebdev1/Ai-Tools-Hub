
import { TOOLS_DATA } from "./src/data/toolsData";

const userRequestedSlugs = [
  "volumetric-flow-rate-converter",
  "comma-separator",
  "reactive-power-converter",
  "illuminance-converter",
  "text-to-slug",
  "binary-to-text",
  "json-minify",
  "url-parser",
  "remove-line-breaks",
  "html-decode",
  "roman-numerals-to-number",
  "cpm-calculator",
  "each-converter",
  "javascript-obfuscator",
  "parts-per-converter",
  "number-to-roman-numerals",
  "text-to-decimal",
  "current-converter",
  "ascii-to-text",
  "json-to-tsv",
  "json-editor",
  "octal-to-hex",
  "probability-calculator",
  "html-encode"
];

const matches = userRequestedSlugs.map(slug => {
    const matched = TOOLS_DATA.find(t => t.slug === slug || t.id === slug);
    return {
        slug,
        found: !!matched,
        matchedSlug: matched?.slug
    };
});

console.log(JSON.stringify(matches, null, 2));
