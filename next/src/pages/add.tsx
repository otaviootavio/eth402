import { useState, FormEvent } from "react";

export default function Add() {
  const [txid, setTxid] = useState("");
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      <h1>Add Balance</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          placeholder="Transaction ID"
          required
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
        />
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Signature"
          required
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Add Balance</button>
      </form>
      {balance !== null && <p>Balance: {balance}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
