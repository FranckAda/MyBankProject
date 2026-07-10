import { useState, useEffect } from "react";
import { X, Wallet } from "lucide-react";
import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";
import ExpenseList from "../ExpenseList";
import { useAuth } from "../../Contexts/useAuth";

const Notif = () => {
  const { user, setHasNewActivity } = useAuth();
  const transactions = user?.transactions || [];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setHasNewActivity(false);
  }, [setHasNewActivity]);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Notifications" subtitle="Manage your notifications" />

        <ExpenseList expenses={transactions} onSelect={setSelected} />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Transaction</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Wallet size={28} className="text-gray-500" />
              </div>
              <p className="text-2xl font-bold">
                <span
                  className={
                    selected.amount > 0 ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {selected.amount > 0 ? "+" : ""}
                  {Math.abs(selected.amount).toFixed(2)} €
                </span>
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="font-medium text-gray-800">
                  {selected.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="font-medium text-gray-800">
                  {selected.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notif;
