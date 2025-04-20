import fs from "fs";
import path from "path";

let res = "export const contracts = {";

// TODO: investigate direct conversions of contract ABI to typescript

let dirEntries: fs.Dirent[] = [];

try {
  dirEntries.push(
    ...fs.readdirSync(path.join(".deploys", "pinned-contracts"), { recursive: true, withFileTypes: true }),
  );
  dirEntries.push(
    ...fs.readdirSync(path.join(".deploys", "deployed-contracts"), { recursive: true, withFileTypes: true }),
  );
} catch (e: unknown) {
  // One of those dirs can not exist, and it's fine
  if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) {
    throw e;
  }
}

dirEntries = dirEntries.filter(
  (entry) => entry.isFile() && entry.name.startsWith("0x") && entry.name.endsWith(".json"),
);

if (dirEntries.length === 0) {
  console.warn(
    "No contracts found; remember to pin deployed contracts in Remix or build them locally, in order to use them from frontend",
  );
  process.exit();
}

for (const entry of dirEntries) {
  const strippedAddress = entry.name.slice(2, entry.name.length - 5);

  console.log(`Processing contract ${strippedAddress}`);

  const value = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf-8");
  res += `\n  "${strippedAddress}": ${value},\n`;
}

res += "};";
const outPath = path.join("dist", "contracts.js");
fs.writeFileSync(outPath, res);

console.log(`Exported contracts to ${outPath}`);
