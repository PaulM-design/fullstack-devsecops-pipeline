import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Home from "./page";

afterEach(() => vi.unstubAllGlobals());

test("renders the secure delivery stages", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => {
    if (url.endsWith("/health")) {
      return Promise.resolve({ ok: true, json: async () => ({ status: "ok", environment: "production" }) });
    }
    if (url.includes("/actions/runs?")) {
      return Promise.resolve({ ok: true, json: async () => ({ workflow_runs: [] }) });
    }
    return Promise.resolve({ ok: false });
  }));
  render(await Home());
  expect(screen.getByRole("heading", { name: /proof over promises/i })).toBeInTheDocument();
  expect(screen.getByText("Security checks")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /run safe request/i })).toBeInTheDocument();
  expect(screen.getByText(/API HEALTHY/)).toBeInTheDocument();
});

