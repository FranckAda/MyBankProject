import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../Layout/TopBar";
import { AuthContext } from "../../Contexts/AuthContext";

const renderTopBar = (props = {}, initialRoute = "/") =>
  render(
    <AuthContext.Provider value={{ hasNewActivity: false, setHasNewActivity: () => {}, user: null, loading: false }}>
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
  it("affiche les liens notifications et profil", () => {
    renderTopBar();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("les liens pointent vers les bonnes routes", () => {
    renderTopBar();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/notifications");
    expect(hrefs).toContain("/profile");
  });
});
