import { compile } from "@parity/revive";
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "fs";
import path from "path";

// based on https://github.com/paritytech/contracts-boilerplate/tree/e86ffe91f7117faf21378395686665856c605132/ethers/tools

const buildDir = ".build";
const contractsOutDir = path.join(buildDir, "contracts");
rmSync(contractsOutDir, { recursive: true, force: true });
mkdirSync(contractsOutDir, { recursive: true });

const contracts = readdirSync(process.cwd()).filter((f) => f.endsWith(".sol"));

console.log("Compiling contracts...");

(async () => {
  for (const file of contracts) {
    console.log(`Compiling ${file}`);
    const name = path.basename(file, ".sol");

    const input = {
      [name]: { content: readFileSync(file, "utf8") }
    };

    const out = await compile(input);

    for (const contracts of Object.values(out.contracts)) {
      for (const [name, contract] of Object.entries(contracts)) {
        console.log(`Writing contract ${name}...`);
        writeFileSync(
          path.join(contractsOutDir, `${name}.json`),
          JSON.stringify({ abi: contract.abi, bytecode: `0x${contract.evm.bytecode.object}` }, null, 2)
        );
      }
    }
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
