import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../Layout/ProtectedRoute";
import { AuthContext } from "../../Contexts/AuthContext";

function renderProtectedRoute(contextValue) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={contextValue}>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("shows loading when still loading", () => {
    renderProtectedRoute({
      isAuthenticated: false,
      loading: true,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderProtectedRoute({
      isAuthenticated: false,
      loading: false,
    });
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    renderProtectedRoute({
      isAuthenticated: true,
      loading: false,
    });
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
