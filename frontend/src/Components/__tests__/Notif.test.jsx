import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Notif from "../Pages/Notif";
import { AuthContext } from "../../Contexts/AuthContext";

const mockTransactions = [
  { id: 1, amount: -50, date: "01-06-2025", category: "Alimentation" },
  { id: 2, amount: 2000, date: "02-06-2025", category: "Revenu" },
  { id: 3, amount: -30, date: "03-06-2025", category: "Transport" },
];

function renderNotif(transactions = mockTransactions) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: { transactions },
          loading: false,
          isAuthenticated: true,
          login: async () => {},
          register: async () => {},
          logout: () => {},
          hasNewActivity: true,
          setHasNewActivity: vi.fn(),
          fetchUser: async () => {},
        }}
      >
        <Notif />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("Notif - Notifications", () => {
  it("renders the notifications page title", () => {
    renderNotif();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Notifications");
  });

  it("renders the subtitle", () => {
    renderNotif();
    expect(
      screen.getByText("Manage your notifications"),
    ).toBeInTheDocument();
  });

  it("renders all transaction categories", () => {
    renderNotif();
    expect(screen.getAllByText("Alimentation").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Revenu").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Transport").length).toBeGreaterThanOrEqual(1);
  });

  it("calls setHasNewActivity(false) on mount", () => {
    const setHasNewActivity = vi.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { transactions: mockTransactions },
            loading: false,
            isAuthenticated: true,
            login: async () => {},
            register: async () => {},
            logout: () => {},
            hasNewActivity: true,
            setHasNewActivity,
            fetchUser: async () => {},
          }}
        >
          <Notif />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(setHasNewActivity).toHaveBeenCalledWith(false);
  });

  it("opens transaction modal on click and shows details", () => {
    renderNotif();
    const firstExpense = screen.getAllByText("Alimentation")[0];
    fireEvent.click(firstExpense);
    expect(screen.getByText("Transaction")).toBeInTheDocument();
    expect(screen.getAllByText("01-06-2025").length).toBeGreaterThanOrEqual(1);
  });

  it("closes modal when clicking the overlay background", () => {
    renderNotif();
    const firstExpense = screen.getAllByText("Alimentation")[0];
    fireEvent.click(firstExpense);
    expect(screen.getByText("Transaction")).toBeInTheDocument();

    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) fireEvent.click(overlay);
    expect(screen.queryByText("Transaction")).not.toBeInTheDocument();
  });
});
