import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../Admin/Login";
import { AuthContext } from "../../Contexts/AuthContext";

const renderLogin = (authValues = {}) => {
  const defaultAuth = {
    login: vi.fn().mockResolvedValue({}),
    register: vi.fn().mockResolvedValue({}),
    user: null,
    loading: false,
  };
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...defaultAuth, ...authValues }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Login - Sign In mode", () => {
  it("renders sign-in form by default", () => {
    renderLogin();
    expect(
      screen.getByText("Sign in to your account"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("does not show confirm password field in sign-in mode", () => {
    renderLogin();
    expect(
      screen.queryByPlaceholderText("Confirm your password"),
    ).not.toBeInTheDocument();
  });

  it("calls login on form submit", async () => {
    const login = vi.fn().mockResolvedValue({});
    renderLogin({ login });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@test.com", "secret");
    });
  });

  it("shows error message on login failure", async () => {
    const login = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
    renderLogin({ login });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});

describe("Login - Register mode", () => {
  it("switches to register mode and shows extra fields", () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account/i));

    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("validates password confirmation in register mode", async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account/i));

    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "different" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("calls register on valid form submit", async () => {
    const register = vi.fn().mockResolvedValue({});
    renderLogin({ register });

    fireEvent.click(screen.getByText(/don't have an account/i));

    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "pass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        mail: "john@test.com",
        password: "pass123",
        name: "John",
        lastname: "Doe",
      });
    });
  });
});
