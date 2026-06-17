import { Briefcase, ShoppingCart, Train, Tv, Utensils } from "lucide-react";
import PropTypes from "prop-types";

const ExpenseList = () => {
  const expenses = [
    {
      id: 1,
      name: "Netflix",
      date: "Aujourd'hui, 14:30",
      amount: -13.99,
      category: "Abonnement",
      Icon: Tv,
    },
    {
      id: 2,
      name: "Salaire",
      date: "Hier, 09:00",
      amount: 1500.0,
      category: "Revenu",
      Icon: Briefcase,
    },
    {
      id: 3,
      name: "Carrefour",
      date: "25 Avr",
      amount: -45.6,
      category: "Alimentation",
      Icon: ShoppingCart,
    },
    {
      id: 4,
      name: "Transport",
      date: "24 Avr",
      amount: -35.0,
      category: "Transport",
      Icon: Train,
    },
    {
      id: 5,
      name: "Restaurant",
      date: "23 Avr",
      amount: -28.5,
      category: "Loisirs",
      Icon: Utensils,
    },
  ];
  return (
    <>
      {expenses && expenses.length > 0 ? (
        <div className="space-y-4">
          {expenses.map(({ id, name, date, amount, category, Icon }, i) => (
            <div key={id}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{name}</p>
                  <p className="text-gray-400 text-xs">{date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`font-bold text-sm ${amount > 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {amount > 0 ? "+" : ""}
                    {amount.toFixed(2)} €
                  </p>
                  <p className="text-gray-400 text-xs">{category}</p>
                </div>
              </div>
              {i < expenses.length - 1 && (
                <div className="mt-4 border-b border-gray-100" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <h1>no expenses</h1>
      )}
    </>
  );
};

export default ExpenseList;
