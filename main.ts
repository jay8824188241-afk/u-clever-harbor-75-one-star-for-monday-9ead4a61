// One Star for Monday — deterministic entry generator.
// Writes a one-star review of Monday to $MAKEFUN_OUTPUT_DIR/entry.txt,
// then reads it back and self-checks it byte-for-byte.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = [
  "★☆☆☆☆ Monday",
  "Monday showed up uninvited, stole my weekend, and brought nothing but alarms and traffic.",
  "One star. Would not recommend. Would not repeat.",
].join("\n") + "\n";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read back and verify byte-identical, non-empty, and in format.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  console.error("self-check failed: written bytes differ from expected");
  process.exit(1);
}
if (back.length === 0) {
  console.error("self-check failed: entry is empty");
  process.exit(1);
}
const expectedBytes = Buffer.byteLength(ENTRY, "utf8");
const actualBytes = Buffer.byteLength(back, "utf8");
if (actualBytes !== expectedBytes) {
  console.error(
    `self-check failed: byte length ${actualBytes} != expected ${expectedBytes}`,
  );
  process.exit(1);
}
const lines = back.replace(/\n$/, "").split("\n");
if (lines.length > 5) {
  console.error("self-check failed: too many lines");
  process.exit(1);
}
for (const line of lines) {
  if (line.length > 280) {
    console.error("self-check failed: line exceeds 280 chars");
    process.exit(1);
  }
}
if (!back.includes("Monday") || !back.includes("One star")) {
  console.error("self-check failed: entry is not a one-star review of Monday");
  process.exit(1);
}

console.log(`wrote ${outPath} (${Buffer.byteLength(back, "utf8")} bytes)`);
