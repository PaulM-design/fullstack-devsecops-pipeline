"use client";

import { useState } from "react";

type DemoResponse = { message: string; timestamp: string };

export default function SafeRequestButton() {
  const [result, setResult] = useState<DemoResponse | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function runRequest() {
    setState("loading");
    setResult(null);
    try {
      const response = await fetch("/api/demo", { method: "POST" });
      if (!response.ok) throw new Error("Request failed");
      setResult((await response.json()) as DemoResponse);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="request-control">
      <button type="button" onClick={runRequest} disabled={state === "loading"}>
        {state === "loading" ? "RUNNING..." : "RUN SAFE REQUEST"}
      </button>
      <div className="request-result" aria-live="polite">
        {result && <><b>200 OK</b><span>{result.message}</span><small>{new Date(result.timestamp).toLocaleString()}</small></>}
        {state === "error" && <span>Request failed. The backend may be unavailable.</span>}
        {!result && state === "idle" && <span>Calls FastAPI /api/message. No data is changed.</span>}
      </div>
    </div>
  );
}
