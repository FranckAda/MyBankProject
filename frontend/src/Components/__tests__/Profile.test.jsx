import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Profile from "../Pages/Profile";
import { AuthContext } from "../../Contexts/AuthContext";

const mockUser = {
  id: 1,
  name: "John",
  lastname: "Doe",
  mail: "john@test.com",
  role: "client",
};

function renderProfile(user = mockUser) {
  return render(
    <MemoryRouter>
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
          fetchUser: vi.fn().mockResolvedValue({}),
        }}
      >
        <Profile />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Profile", () => {
  it("renders profile page heading", () => {
    renderProfile();
    expect(
      screen.getByRole("heading", { name: /profile/i }),
    ).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    renderProfile();
    expect(screen.getByText("Managing your informations")).toBeInTheDocument();
  });

  it("displays personal information heading", () => {
    renderProfile();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("pre-fills form fields with user data", () => {
    renderProfile();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@test.com")).toBeInTheDocument();
  });

  it("displays password and confirm password fields", () => {
    renderProfile();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderProfile();
    global.fetch = vi.fn();

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "different" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("calls apiFetch on valid form submit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    renderProfile(mockUser);

    fireEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully"),
      ).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Update failed" }),
    });

    renderProfile(mockUser);

    fireEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });
});
