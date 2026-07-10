import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ExpenseForm from "../ExpenseForm";
import { AuthContext } from "../../Contexts/AuthContext";

const mockUser = {
  id: 1,
  name: "John",
  account: 500,
  categories: [{ id: 13, name: "Alimentation" }],
};

describe("ExpenseForm — affichage", () => {
  it("affiche les champs du formulaire", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser, setHasNewActivity: () => {}, fetchUser: async () => {}, loading: false }}>
          <ExpenseForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Montant (€)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});
