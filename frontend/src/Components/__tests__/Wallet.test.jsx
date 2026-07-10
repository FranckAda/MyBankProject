import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Wallet from "../Pages/Wallet";
import { AuthContext } from "../../Contexts/AuthContext";

const mockUser = {
  id: 1,
  name: "John",
  lastname: "Doe",
  mail: "john@test.com",
  role: "client",
  account: 1000,
  categories: [{ id: 13, name: "Alimentation" }],
};

function renderWallet() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          login: async () => {},
          register: async () => {},
          logout: () => {},
          hasNewActivity: false,
          setHasNewActivity: () => {},
          fetchUser: async () => {},
        }}
      >
        <Wallet />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("Wallet", () => {
  it("renders the wallet page title", () => {
    renderWallet();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Wallet");
  });

  it("renders the wallet page subtitle", () => {
    renderWallet();
    expect(screen.getByText("Manage your finances")).toBeInTheDocument();
  });

  it("renders the expense form with amount input", () => {
    renderWallet();
    expect(screen.getByText("Montant (€)")).toBeInTheDocument();
  });

  it("renders the expense form with submit button", () => {
    renderWallet();
    expect(
      screen.getByRole("button", { name: /send/i }),
    ).toBeInTheDocument();
  });
});
