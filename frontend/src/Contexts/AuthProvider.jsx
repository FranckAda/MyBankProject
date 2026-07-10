import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch, getToken, setToken, removeToken } from "../lib/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNewActivity, setHasNewActivity] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch("/api/me");
      if (!res.ok) {
        removeToken();
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (mail, password) => {
    const res = await fetch("/api/login_check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Invalid credentials" }));
      throw new Error(err.message || err.error || "Invalid credentials");
    }

    const data = await res.json();
    setToken(data.token);
    await fetchUser();
    return data;
  };

  const register = async ({ mail, password, name, lastname, role }) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password, name, lastname, role: role || "client" }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(err.error || err.errors || "Registration failed");
    }

    await login(mail, password);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user, hasNewActivity, setHasNewActivity, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
