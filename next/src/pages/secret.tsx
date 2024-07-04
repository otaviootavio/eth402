import { useState, FormEvent } from "react";

export default function Secret() {
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      <h1>Get Secret</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Get Secret</button>
      </form>
      {secret && <p>Secret: {secret}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
