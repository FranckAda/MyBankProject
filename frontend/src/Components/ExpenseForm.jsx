import { PlusCircle, Send } from "lucide-react";
import { useAuth } from "../Contexts/useAuth";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate } from "react-router-dom";
const EMPTY_FORM = {
  amount: "",
  idUser: "",
  idCategory: "",
};
const ExpenseForm = () => {
  const { user, setHasNewActivity, fetchUser } = useAuth();
  const [buying, setBuying] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setBuying(true);
    const amount = parseFloat(formData.amount);
    const payload = {
      amount: -amount,
      idUser: user.id,
      idCategory: formData.idCategory,
    };
    if (user.account >= -payload.amount) {
      try {
        const response = await apiFetch("/api/expenses/new", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to submit expense");
        }
        setFormData(EMPTY_FORM);
        setHasNewActivity(true);
        await fetchUser();
      } catch (error) {
        console.error("Error submitting expense:", error);
      } finally {
        setBuying(false);
        navigate("/");
      }
    } else {
      alert("Insufficient funds to submit this expense.");
      setBuying(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <h2 className="text-teal-800 font-semibold text-base mb-5 flex items-center gap-2">
        <PlusCircle size={18} /> Ajouter une dépense
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-500 font-medium" htmlFor="domain">
            Domaine de dépense
          </label>
          <select
            id="domain"
            value={formData.idCategory}
            onChange={(e) =>
              setFormData({ ...formData, idCategory: e.target.value })
            }
            className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Sélectionner...</option>
            {user?.categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            className=" text-sm text-gray-500 font-medium"
            htmlFor="amount"
          >
            Montant (€)
          </label>
          <input
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            type="number"
            id="amount"
            className="no-spinner h-10 border border-gray-200 text-right rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="0,00"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={buying}
        className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Send size={16} /> {buying ? "Sending" : "Send"}
      </button>
    </form>
  );
};
export default ExpenseForm;
