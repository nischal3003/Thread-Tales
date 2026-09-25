"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "done") return;

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 280, maxWidth: 480 }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          className="input"
          style={{ flex: 1, minWidth: 200, background: "#fff", color: "var(--text)" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "done"}
          required
        />
        <button
          type="submit"
          className="btn"
          style={{ background: "var(--text)", color: "#fff" }}
          disabled={status === "loading" || status === "done"}
        >
          {status === "loading" ? "Subscribing…" : status === "done" ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{message}</span>
      )}
    </form>
  );
}
