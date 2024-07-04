import { useState, FormEvent } from "react";
import { useWalletClient } from "wagmi";
import WalletAddress from "./ServerWalletAddress";

export default function AddAmmounForms() {
  const [txid, setTxid] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data } = useWalletClient();
  if (!data)
    return (
      <div className="bg-red-700 text-slate-50"> Account not connected</div>
    );

  const address = data.account.address;
  const message = "Ola mundo!";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const signature = await data.signMessage({ message });

    try {
      const response = await fetch("/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid, address, signature, message }),
      });
      const data = await response.json();
      setBalance(Number(data.balance));
      setError(null);
    } catch (err) {
      setError("Failed to update balance");
      setBalance(null);
    }
  };

  return (
    <div>
      <WalletAddress />
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <input
            type="text"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder="Transaction ID"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Balance
        </button>
      </form>
      {balance !== null && (
        <p className="mt-4 text-green-500 font-semibold">Balance: {balance}</p>
      )}
      {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
