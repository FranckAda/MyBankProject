import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../useAuth";
import AuthProvider from "../AuthProvider";

function TestComponent() {
  const { user, loading, isAuthenticated, login, register, logout, fetchUser } =
    useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? user.mail : "null"}</span>
      <button
        data-testid="btn-login"
        onClick={() => login("test@test.com", "password").catch(() => {})}
      >
        Login
      </button>
      <button
        data-testid="btn-register"
        onClick={() =>
          register({
            mail: "new@test.com",
            password: "pass",
            name: "John",
            lastname: "Doe",
          }).catch(() => {})
        }
      >
        Register
      </button>
      <button data-testid="btn-logout" onClick={logout}>
        Logout
      </button>
      <button data-testid="btn-fetch" onClick={fetchUser}>
        Fetch
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("AuthProvider", () => {
  it("becomes not authenticated when no token", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("loads user data on mount when token exists", async () => {
    localStorage.setItem("jwt_token", "valid-token");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        mail: "user@test.com",
        name: "John",
        lastname: "Doe",
        role: "client",
      }),
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("user@test.com");
  });

  it("calls /api/login_check on login and stores token", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "new-jwt-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          mail: "test@test.com",
          name: "John",
          lastname: "Doe",
          role: "client",
        }),
      });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    screen.getByTestId("btn-login").click();

    await waitFor(() => {
      expect(localStorage.getItem("jwt_token")).toBe("new-jwt-token");
    });
    expect(fetch).toHaveBeenCalledWith("/api/login_check", expect.any(Object));
  });

  it("calls /api/register on register then logs in", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "register-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 2,
          mail: "new@test.com",
          name: "John",
          lastname: "Doe",
          role: "client",
        }),
      });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    screen.getByTestId("btn-register").click();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/register", expect.any(Object));
    });
    expect(fetch).toHaveBeenCalledWith("/api/login_check", expect.any(Object));
  });

  it("clears user on logout", async () => {
    localStorage.setItem("jwt_token", "some-token");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        mail: "user@test.com",
        name: "John",
        lastname: "Doe",
        role: "client",
      }),
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    });

    screen.getByTestId("btn-logout").click();

    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(localStorage.getItem("jwt_token")).toBeNull();
  });

  it("handles login failure gracefully", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Invalid credentials" }),
      });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    screen.getByTestId("btn-login").click();

    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    }, { timeout: 3000 });
  });
});
