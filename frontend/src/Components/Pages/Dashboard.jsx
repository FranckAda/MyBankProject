import { useState, useEffect } from "react";
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
  Pencil,
  Trash2,
  HandHeart,
  Smile,
  Plane,
  Shirt,
  X,
  Check,
  HandFist,
} from "lucide-react";
import Header from "../Layout/Header";
import { NavLink } from "react-router-dom";
import TopBar from "../Layout/TopBar";
import ExpenseList from "../ExpenseList";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../Contexts/useAuth";

const quickActions = [
  { label: "Wallet", Icon: Wallet, bg: "bg-teal-700", text: "text-white" },
  { label: "Invest", Icon: TrendingUp, bg: "bg-teal-500", text: "text-white" },
  {
    label: "Card",
    Icon: CreditCard,
    bg: "bg-yellow-400",
    text: "text-teal-800",
  },
  { label: "Save", Icon: PiggyBank, bg: "bg-teal-800", text: "text-white" },
];

const categoryIcons = {
  Alimentation: ShoppingCart,
  Transport: Train,
  Loisirs: Smile,
  Abonnements: Tv,
  Revenu: Briefcase,
  Santé: HandHeart,
  Éducation: Pencil,
  Épargne: PiggyBank,
  Habillement: Shirt,
  Voyage: Plane,
  Restauration: Utensils,
  Sport: HandFist,
};

const defaultIcon = Wallet;

const EMPTY_FORM = {
  mail: "",
  name: "",
  lastname: "",
  role: "client",
  password: "",
};

const Dashboard = () => {
  const calcul = (total, depense) => {
    const a = total - depense;
    const b = (a * 100) / total;
    return Math.round(100 - b);
  };

  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const depense = user?.monthSpending || 0;
  const monthRevenue = user?.monthRevenue || 0;
  const transactions = (user?.transactions || []).map((t) => ({
    ...t,
    Icon: categoryIcons[t.category] || defaultIcon,
    name: t.category || "Dépense",
  }));

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await apiFetch("/api/users");
      const data = await response.json();

      if (response.status === 404) {
        setUsers([]);
        return;
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Erreur lors du chargement",
        );
      }
      setUsers(data.users || []);
    } catch (error) {
      console.error("Erreur:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setError("");
    setFormData({
      mail: user.mail || "",
      name: user.name || "",
      lastname: user.lastname || "",
      role: user.role || "client",
      password: "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(userId) {
    try {
      setSavingId(userId);
      setError("");

      const payload = {
        mail: formData.mail.trim(),
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        role: formData.role,
      };

      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const response = await apiFetch(`/api/users/${userId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors ||
            data.error ||
            data.message ||
            "Erreur lors de la mise à jour",
        );
      }

      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(userId) {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      setDeletingId(userId);
      setError("");

      const response = await apiFetch(`/api/users/${userId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Erreur lors de la suppression",
        );
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (editingId === userId) cancelEdit();
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex flex-col lg:flex-row font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={`Bonjour, ${user.name}`} />
        {user?.role === "client" && (
          <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 px-4 md:px-8 pt-4 lg:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
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
                  {balanceVisible ? `${user?.account.toFixed(2)} €` : "••••••"}
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

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <p className="text-teal-700 font-semibold text-sm mb-1">
                  Expenses this month
                </p>
                <p className="text-3xl font-bold text-teal-600">{depense} €</p>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${calcul(monthRevenue, depense) > 100 ? 100 : calcul(monthRevenue, depense)}%`,
                    }}
                  />
                </div>
                <p
                  className={`text-xs  mt-1 ${calcul(monthRevenue, depense) > 100 ? "text-red-500" : "text-gray-400"}`}
                >
                  {calcul(monthRevenue, depense)}% of the monthly budget
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <p className="text-teal-700 font-semibold text-sm mb-1">
                  Revenues this month
                </p>
                <p className="text-3xl font-bold text-emerald-500">
                  {monthRevenue.toFixed(2)} €
                </p>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Total income</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-teal-700 font-bold text-base mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {quickActions.map(({ label, Icon, bg, text }) => (
                  <NavLink
                    key={label}
                    to={label === "Wallet" ? "/wallet" : "/upcoming"}
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

            {/* Transactions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
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
              <ExpenseList expenses={transactions} />
            </div>
          </main>
        )}
        
        {user?.role === "admin" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-teal-700 font-bold text-base mb-4">
              User Management
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400 text-sm">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase">
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Email</th>
                      <th className="text-left py-2 pr-4">Role</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        {editingId === user.id ? (
                          <>
                            <td className="py-2 pr-4">
                              <div className="flex gap-2">
                                <input
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="border border-gray-200 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  placeholder="First name"
                                />
                                <input
                                  name="lastname"
                                  value={formData.lastname}
                                  onChange={handleChange}
                                  className="border border-gray-200 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  placeholder="Last name"
                                />
                              </div>
                            </td>
                            <td className="py-2 pr-4">
                              <input
                                name="mail"
                                value={formData.mail}
                                onChange={handleChange}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-40 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                placeholder="Email"
                              />
                            </td>
                            <td className="py-2 pr-4">
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                              >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-2 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleSave(user.id)}
                                  disabled={savingId === user.id}
                                  className="text-teal-600 hover:text-teal-800 transition-colors disabled:opacity-50"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 pr-4 font-medium text-gray-800">
                              {user.name} {user.lastname}
                            </td>
                            <td className="py-2 pr-4 text-gray-500">
                              {user.mail}
                            </td>
                            <td className="py-2 pr-4">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  user.role === "admin"
                                    ? "bg-teal-100 text-teal-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-2 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => startEdit(user)}
                                  className="text-teal-500 hover:text-teal-700 transition-colors"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  disabled={deletingId === user.id}
                                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
