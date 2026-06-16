import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "../Layout/Header";

// Helper : render avec le router requis par NavLink
const renderHeader = (initialRoute = "/") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );

// ─────────────────────────────────────────
// Affichage général
// ─────────────────────────────────────────
describe("Header — affichage général", () => {
  it("affiche le logo MyBank", () => {
    renderHeader();
    expect(screen.getByText("MyBank")).toBeInTheDocument();
  });

  it("affiche les informations de l'utilisateur (nom + rôle)", () => {
    renderHeader();
    expect(screen.getByText("UserName")).toBeInTheDocument();
    expect(screen.getByText("AccountType")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────
// Liens de navigation
// ─────────────────────────────────────────
describe("Header — liens de navigation", () => {
  it("affiche tous les liens de navigation", () => {
    renderHeader();
    // Chaque label apparaît au moins une fois (sidebar + bottom nav)
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Wallet").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Card").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Profile").length).toBeGreaterThanOrEqual(1);
  });

  it("les liens pointent vers les bonnes routes", () => {
    renderHeader();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/wallet");
    expect(hrefs).toContain("/upcoming");
    expect(hrefs).toContain("/profile");
  });
});

// ─────────────────────────────────────────
// Lien actif
// ─────────────────────────────────────────
describe("Header — lien actif", () => {
  it('applique la classe active sur le lien "/" quand on est sur "/"', () => {
    renderHeader("/");
    // getAllByRole car le lien existe dans la sidebar ET la bottom nav
    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    const activeLink = homeLinks.find(
      (l) => l.getAttribute("aria-current") === "page",
    );
    expect(activeLink).toBeTruthy();
  });

  it('applique la classe active sur "/wallet" quand on est sur "/wallet"', () => {
    renderHeader("/wallet");
    const walletLinks = screen.getAllByRole("link", { name: /wallet/i });
    const activeLink = walletLinks.find(
      (l) => l.getAttribute("aria-current") === "page",
    );
    expect(activeLink).toBeTruthy();
  });

  it("n'applique pas la classe active sur un lien non courant", () => {
    renderHeader("/");
    const cardLinks = screen.getAllByRole("link", { name: /card/i });
    const activeLink = cardLinks.find(
      (l) => l.getAttribute("aria-current") !== "page",
    );
    expect(activeLink).toBeFalsy();
  });
});
