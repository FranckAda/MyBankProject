import { useState } from "react";
import {
  Eye,
  EyeOff,
  Send,
  HandCoins,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Tv,
  Briefcase,
  ShoppingCart,
  Train,
  Utensils,
} from "lucide-react";

import Header from "../Layout/Header";
import { NavLink } from "react-router-dom";
import TopBar from "../Layout/TopBar";
const transactions = [
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

const quickActions = [
  {
    label: "Wallet",
    Icon: Wallet,
    bg: "bg-teal-700",
    text: "text-white",
  },
  {
    label: "Invest",
    Icon: TrendingUp,
    bg: "bg-teal-500",
    text: "text-white",
  },
  {
    label: "Card",
    Icon: CreditCard,
    bg: "bg-yellow-400",
    text: "text-teal-800",
  },
  {
    label: "Save",
    Icon: PiggyBank,
    bg: "bg-teal-800",
    text: "text-white",
  },
];

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex flex flex-col lg:flex-row font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        {/* Page body */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 px-4 md:px-8 pt-4 lg:pt-6">
          {/* ── Top grid: balance + stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {/* Balance Card */}
            <div className="md:col-span-2 xl:col-span-1 bg-teal-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-teal-200 text-sm">Current balance</span>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-teal-200 hover:text-white transition-colors"
                >
                  {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-4xl font-bold mb-6">
                {balanceVisible ? "2 847,50 €" : "••••••"}
              </div>
              <div className="flex gap-3">
                <NavLink
                  to="/wallet"
                  className="flex-1 bg-emerald-400 hover:bg-emerald-300 transition text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send
                </NavLink>
                <NavLink
                  to="/upcoming"
                  className="flex-1 bg-yellow-300 hover:bg-yellow-200 transition text-teal-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <HandCoins size={16} /> Request
                </NavLink>
              </div>
            </div>

            {/* Expenses this month */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-teal-700 font-semibold text-sm mb-1">
                Expenses this month
              </p>
              <p className="text-3xl font-bold text-teal-600">1 280,00 €</p>
              <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                45% of the monthly budget
              </p>
            </div>

            {/* Revenues this month */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-teal-700 font-semibold text-sm mb-1">
                Revenues this month
              </p>
              <p className="text-3xl font-bold text-emerald-500">1 500,00 €</p>
              <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-400 h-2 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Total income</p>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-teal-700 font-bold text-base mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
              {quickActions.map(({ label, Icon, bg, text }) => (
                <NavLink
                  key={label}
                  to={{
                    pathname: label === "Wallet" ? "/wallet" : "/upcoming",
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`${bg} w-14 h-14 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} className={text} />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* ── Transactions ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-teal-700 font-bold text-base">
                Recent Transactions
              </h2>
              <NavLink
                to="/notifications"
                className="text-teal-500 text-sm font-medium hover:underline"
              >
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {transactions.map(
                ({ id, name, date, amount, category, Icon }, i) => (
                  <div key={id}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">
                          {name}
                        </p>
                        <p className="text-gray-400 text-xs">{date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`font-bold text-sm ${amount > 0 ? "text-emerald-500" : "text-gray-800"}`}
                        >
                          {amount > 0 ? "+" : ""}
                          {amount.toFixed(2)} €
                        </p>
                        <p className="text-gray-400 text-xs">{category}</p>
                      </div>
                    </div>
                    {i < transactions.length - 1 && (
                      <div className="mt-4 border-b border-gray-100" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
