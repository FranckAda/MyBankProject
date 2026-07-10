import { describe, it, expect, beforeEach, vi } from "vitest";
import { getToken, setToken, removeToken, apiFetch } from "../api";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("Token management", () => {
  it("getToken returns null when no token", () => {
    expect(getToken()).toBeNull();
  });

  it("setToken stores token in localStorage", () => {
    setToken("my-jwt-token");
    expect(localStorage.getItem("jwt_token")).toBe("my-jwt-token");
  });

  it("getToken returns stored token", () => {
    setToken("test-token");
    expect(getToken()).toBe("test-token");
  });

  it("removeToken clears token from localStorage", () => {
    setToken("test-token");
    removeToken();
    expect(localStorage.getItem("jwt_token")).toBeNull();
  });
});

describe("apiFetch", () => {
  it("sets Authorization header when token exists", async () => {
    setToken("bearer-token");
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });

    await apiFetch("/api/test");

    expect(fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer bearer-token",
        }),
      }),
    );
  });

  it("sets Content-Type to application/json by default", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });

    await apiFetch("/api/test");

    expect(fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("does not override provided Content-Type header", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });

    await apiFetch("/api/test", {
      headers: { "Content-Type": "text/plain" },
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "text/plain",
        }),
      }),
    );
  });

  it("does not set Content-Type for FormData body", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });
    const formData = new FormData();

    await apiFetch("/api/test", { body: formData });

    const callHeaders = fetch.mock.calls[0][1].headers;
    expect(callHeaders["Content-Type"]).toBeUndefined();
  });

  it("removes token and redirects on 401", async () => {
    setToken("expired-token");
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
    global.fetch = vi.fn().mockResolvedValue({ status: 401 });

    await expect(apiFetch("/api/protected")).rejects.toThrow("Session expired");
    expect(localStorage.getItem("jwt_token")).toBeNull();
  });

  it("returns the response on success", async () => {
    const mockResponse = { status: 200, ok: true };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await apiFetch("/api/test");
    expect(response).toBe(mockResponse);
  });

  it("passes through options like method and body", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });

    await apiFetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ foo: "bar" }),
      }),
    );
  });
});
