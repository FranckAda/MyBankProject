// frontend/src/components/__tests__/ExpenseList.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExpenseList from "../ExpenseList";
import { House, ShoppingCart } from "lucide-react";
describe("ExpenseList", () => {
  const mockExpenses = [
  {
    id: 1,
    name: "Loyer",
    amount: 900,
    date: "2025-01-01",
    category: "Housing",
    Icon: House,
  },
  {
    id: 2,
    name: "Courses",
    amount: 120,
    date: "2025-01-05",
    category: "Food",
    Icon: ShoppingCart,
  },
];

  it("affiche toutes les dépenses passées en props", () => {
    render(<ExpenseList expenses={mockExpenses} />);
    // Chaque libellé doit être visible dans la liste
    expect(screen.getByText("Loyer")).toBeInTheDocument();
    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("affiche un message quand la liste est vide", () => {
    render(<ExpenseList expenses={[]} />);
    expect(screen.getByText(/no expenses/i)).toBeInTheDocument();
  });
});
