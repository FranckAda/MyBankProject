import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { AuthContext } from "../AuthContext";

describe("useAuth", () => {
  it("returns context values when used within AuthContext.Provider", () => {
    const mockValue = {
      user: { name: "John" },
      loading: false,
      isAuthenticated: true,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      hasNewActivity: false,
      setHasNewActivity: () => {},
      fetchUser: async () => {},
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
      ),
    });

    expect(result.current.user).toEqual({ name: "John" });
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
