import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import { AuthContext } from "../../Contexts/AuthContext";

const mockClientUser = {
  id: 1,
  name: "John",
  lastname: "Doe",
  mail: "john@test.com",
  role: "client",
  account: 1250.5,
  monthRevenue: 3000,
  monthSpending: 1200,
  transactions: [
    { id: 1, amount: -50, date: "01-06-2025", category: "Alimentation" },
    { id: 2, amount: 2000, date: "01-06-2025", category: "Revenu" },
  ],
  categories: [
    { id: 13, name: "Alimentation" },
    { id: 14, name: "Transport" },
  ],
};

const mockAdminUser = {
  id: 2,
  name: "Admin",
  lastname: "User",
  mail: "admin@test.com",
  role: "admin",
  account: 5000,
  monthRevenue: 0,
  monthSpending: 0,
  transactions: [],
  categories: [],
};

function renderDashboard(user, initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthContext.Provider
        value={{
          user,
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
        <Dashboard />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  it("shows loading while fetching users", () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    });
    renderDashboard(mockAdminUser);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays client dashboard with balance and transactions", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    });
    renderDashboard(mockClientUser);

    expect(screen.getByText("Current balance")).toBeInTheDocument();
    expect(screen.getByText("Expenses this month")).toBeInTheDocument();
    expect(screen.getByText("Revenues this month")).toBeInTheDocument();
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    expect(screen.getByText("View All")).toBeInTheDocument();
  });

  it("displays admin dashboard with User Management section", () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    });
    renderDashboard(mockAdminUser);

    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.queryByText("Current balance")).not.toBeInTheDocument();
    expect(screen.queryByText("Quick Actions")).not.toBeInTheDocument();
  });

  it("renders greeting with user name", () => {
    renderDashboard(mockClientUser);
    expect(screen.getByText("Bonjour, John")).toBeInTheDocument();
  });

  it("handles empty users list for admin", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    });

    renderDashboard(mockAdminUser);
    expect(await screen.findByText("No users found.")).toBeInTheDocument();
  });
});
