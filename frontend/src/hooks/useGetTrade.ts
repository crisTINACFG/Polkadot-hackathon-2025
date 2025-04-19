import { useState, useCallback } from "react";
import { Contract } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

export type Trade = {
  from: string;
  offeredTokenId: number;
  requestedTokenId: number;
  active: boolean;
};

export function useGetTrade(contractData: ContractData) {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrade = useCallback(
    async (tradeId: number) => {
      if (!ethersProvider) return;
      setLoading(true);
      setError(null);
      try {
        const contract = new Contract(
          contractData.address,
          contractData.abi,
          ethersProvider
        );
        const result = await contract.getTrade(tradeId);
        setTrade({
          from: result.from,
          offeredTokenId: result.offeredTokenId.toNumber(),
          requestedTokenId: result.requestedTokenId.toNumber(),
          active: result.active,
        });
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Fetch failed");
        setTrade(null);
      } finally {
        setLoading(false);
      }
    },
    [contractData]
  );

  return { trade, loading, error, getTrade };
}