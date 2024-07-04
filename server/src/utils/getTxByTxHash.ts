import { createPublicClient, http, type Transaction } from "viem";
import { hardhat } from "viem/chains";

export const getTxByTxHash = async (
  txHash: `0x${string}`
): Promise<Transaction> => {
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  return publicClient.getTransaction({
    hash: txHash,
  });
};
