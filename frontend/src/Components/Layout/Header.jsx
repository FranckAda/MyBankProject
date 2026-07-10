import { NavLink, useNavigate } from "react-router-dom";
import { Wallet, CreditCard, Home, User, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../Contexts/useAuth";

const navItems = [
  { label: "Home", Icon: Home, to: "/" },
  { label: "Wallet", Icon: Wallet, to: "/wallet" },
  { label: "Card", Icon: CreditCard, to: "/upcoming" },
  { label: "Profile", Icon: User, to: "/profile" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const visibleItems = navItems.filter(
    (item) => user?.role !== "admin" || item.label === "Home" || item.label === "Profile",
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-teal-800 min-h-screen sticky top-0 self-start p-6 gap-8">
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboard size={27} className="text-yellow-300" />
          <span className="text-white text-xl font-bold">MyBank</span>
        </div>

        <nav className="flex flex-col gap-2">
          {visibleItems.map(({ label, Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-teal-200 hover:bg-teal-700 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-teal-700 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                {user ? `${user.name} ${user.lastname}` : "Guest"}
              </p>
              <p className="text-teal-300 text-xs capitalize">
                {user ? user.role : "---"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium text-teal-200 hover:bg-teal-700 hover:text-white transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-50 shadow-lg">
        {visibleItems.map(({ label, Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? "text-teal-600" : "text-gray-400"}`
            }
          >
            <Icon size={22} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
