import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Home from "./page";

afterEach(() => vi.unstubAllGlobals());

test("renders the secure delivery stages", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  render(await Home());
  expect(screen.getByRole("heading", { name: /ship fast/i })).toBeInTheDocument();
  expect(screen.getByText("Recover")).toBeInTheDocument();
  expect(screen.getByText(/API HEALTHY/)).toBeInTheDocument();
});

