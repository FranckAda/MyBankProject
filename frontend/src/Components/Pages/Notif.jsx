import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";
import ExpenseList from "../ExpenseList";
import { Briefcase, ShoppingCart, Train, Tv, Utensils } from "lucide-react";

const Notif = () => {
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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Notifications" subtitle="Manage your notifications" />

        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
};

export default Notif;
