import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/useAuth";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await register({ mail, password, name, lastname });
      } else {
        await login(mail, password);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-teal-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-700">MyBank</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="John"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              placeholder="Enter your password"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {loading
              ? isRegister
                ? "Registering..."
                : "Signing in..."
              : isRegister
                ? "Create account"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
