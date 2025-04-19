import { useState, useCallback } from "react";
import { Contract } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

type Status = "idle" | "loading" | "success" | "error";

export function useCreateInventory(contractData: ContractData) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const createInventory = useCallback(async () => {
    if (!ethersProvider) return;
    setStatus("loading");
    setError(null);
    try {
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        contractData.address,
        contractData.abi,
        signer
      );
      const tx = await contract.createInventory();
      await tx.wait();
      setStatus("success");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Transaction failed");
      setStatus("error");
    }
  }, [contractData]);

  return { createInventory, status, error };
}