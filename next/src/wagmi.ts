import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  hardhat,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, hardhat],
  ssr: true,
});
