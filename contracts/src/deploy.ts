import { ethers, Interface, BytesLike } from "ethers";
import path from "path";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";

// based on https://github.com/paritytech/contracts-boilerplate/tree/e86ffe91f7117faf21378395686665856c605132/ethers/tools

if (!process.env.ACCOUNT_SEED) {
  console.error("ACCOUNT_SEED environment variable is required for deploying smart contract");
  process.exit(1);
}

if (!process.env.RPC_URL) {
  console.error("RPC_URL environment variable is required for deploying smart contract");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = ethers.Wallet.fromPhrase(process.env.ACCOUNT_SEED, provider);

const buildDir = ".build";
const contractsOutDir = path.join(buildDir, "contracts");
const deploysDir = path.join(".deploys", "deployed-contracts");
mkdirSync(deploysDir, { recursive: true });

const contracts = readdirSync(contractsOutDir).filter((f) => f.endsWith(".json"));

type Contract = {
  abi: Interface,
  bytecode: BytesLike,
}

(async () => {
  for (const file of contracts) {
    const name = path.basename(file, ".json");
    const contract = JSON.parse(readFileSync(path.join(contractsOutDir, file), "utf8")) as Contract;
    const factory = new ethers.ContractFactory(
      contract.abi,
      contract.bytecode,
      wallet
    );

    console.log(`Deploying contract ${name}...`);
    const deployedContract = await factory.deploy();
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();

    console.log(`Deployed contract ${name}: ${address}`);

    const fileContent = JSON.stringify({
      name,
      address,
      abi: contract.abi,
      deployedAt: Date.now()
    });
    writeFileSync(path.join(deploysDir, `${address}.json`), fileContent);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
