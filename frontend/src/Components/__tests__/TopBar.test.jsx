import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../Layout/TopBar";

// Helper : render avec le router requis par NavLink
const renderTopBar = (props = {}, initialRoute = "/") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TopBar {...props} />
    </MemoryRouter>,
  );

// ─────────────────────────────────────────
// Affichage général
// ─────────────────────────────────────────
describe("TopBar — affichage général", () => {
  it("affiche le titre et le sous-titre par défaut", () => {
    renderTopBar();
    expect(screen.getByText("Bonjour, UserName")).toBeInTheDocument();
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
    expect(heading).toHaveTextContent("Bonjour, UserName");
  });
});

// ─────────────────────────────────────────
// Liens de navigation (icônes)
// ─────────────────────────────────────────
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