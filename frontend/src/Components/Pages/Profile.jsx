import { useState } from "react";
import { Save } from "lucide-react";
import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";
import { useAuth } from "../../Contexts/useAuth";
import { apiFetch } from "../../lib/api";

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    mail: user?.mail || "",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        mail: formData.mail.trim(),
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await apiFetch(`/api/users/${user.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors || err.error || err.message || "Update failed");
      }

      setMessage("Profile updated successfully");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      await fetchUser();
    } catch (err) {
      setMessage(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Profile" subtitle="Managing your informations" />
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 px-4 md:px-8 pt-4 lg:pt-6">
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-teal-700 font-bold text-base mb-5">
              Personal Information
            </h2>

            {message && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm ${
                  message.includes("successfully")
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-500 font-medium" htmlFor="name">First Name</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-500 font-medium" htmlFor="lastname">Last Name</label>
                  <input
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500 font-medium" htmlFor="mail">Email</label>
                <input
                  id="mail"
                  name="mail"
                  type="email"
                  value={formData.mail}
                  onChange={handleChange}
                  className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500 font-medium" htmlFor="password">
                  New Password <span className="text-gray-300 font-normal">(leave empty to keep current)</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500 font-medium" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
