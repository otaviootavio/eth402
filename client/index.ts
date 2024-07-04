import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { envLoader } from "./envLoader";

const main = async () => {
  const client = createWalletClient({
    chain: hardhat,
    transport: http(),
  });

  const account = privateKeyToAccount(envLoader.CLIENT_PRIVATE_KEY);

  const hash = await client.sendTransaction({
    account,
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: 10n,
  });

  console.log(hash);
};

main();
