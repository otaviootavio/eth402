import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { envLoader } from "../../../src/envLoader";

export const sendSomeValeToAddress = async (
  value: bigint,
  to: `0x${string}`
) => {
  const client = createWalletClient({
    chain: hardhat,
    transport: http(),
  });

  const account = privateKeyToAccount(envLoader.CLIENT_PRIVATE_KEY);

  const txid = await client.sendTransaction({
    account,
    to,
    value,
  });

  return txid;
};
