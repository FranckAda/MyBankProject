import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../Layout/TopBar";
import { AuthContext } from "../../Contexts/AuthContext";

const renderTopBar = (props = {}, initialRoute = "/", user = null) =>
  render(
    <AuthContext.Provider value={{ hasNewActivity: false, setHasNewActivity: () => {}, user, loading: false }}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <TopBar {...props} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe("TopBar — affichage général", () => {
  it("affiche le titre et le sous-titre par défaut", () => {
    renderTopBar();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bonjour");
    expect(screen.getByText("Welcome to myBank")).toBeInTheDocument();
  });

  it("affiche un titre et sous-titre personnalisés via props", () => {
    renderTopBar({ title: "Bonjour, Alice", subtitle: "Bienvenue !" });
    expect(screen.getByText("Bonjour, Alice")).toBeInTheDocument();
    expect(screen.getByText("Bienvenue !")).toBeInTheDocument();
  });

  it("affiche le titre dans un h1", () => {
    renderTopBar();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Bonjour");
  });
});

describe("TopBar — liens de navigation", () => {
  it("affiche le lien profil pour tout utilisateur", () => {
    renderTopBar({}, "/", { role: "admin" });
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/profile");
    expect(hrefs).not.toContain("/notifications");
  });

  it("affiche les liens notifications et profil pour un client", () => {
    renderTopBar({}, "/", { role: "client" });
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/notifications");
    expect(hrefs).toContain("/profile");
  });
});
