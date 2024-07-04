import { Addreth } from "addreth";
import { useEffect, useState } from "react";

type WalletAddressResponse = {
  address: string;
};

const WalletAddress = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const response = await fetch("/api/wallet-address");
        if (!response.ok) {
          throw new Error("Failed to fetch wallet address");
        }
        const data: WalletAddressResponse = await response.json();

        setWalletAddress(data.address);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchWalletAddress();
  }, []);

  return (
    <div className="px-4 py-2 border bg-white rounded-md ">
      <h1 className="text-slate-900">Wallet Address</h1>
      {walletAddress && <Addreth address={walletAddress as `0x${string}`} />}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default WalletAddress;
