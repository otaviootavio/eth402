import { useState, FormEvent } from "react";
import { useWalletClient } from "wagmi";

export default function QuerySecretForms() {
  const [secret, setSecret] = useState<string | null>(null);
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
      const response = await fetch("/api/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, message }),
      });
      const data = await response.json();
      setSecret(data);
      setError(null);
    } catch (err) {
      setError("Failed to retrieve secret");
      setSecret(null);
    }
  };

  return (
    <div>
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Get Secret
        </button>
      </form>
      {secret && (
        <p className="mt-4 text-green-500 font-semibold">Secret: {secret}</p>
      )}
      {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
