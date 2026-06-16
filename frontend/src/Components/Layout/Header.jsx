import { NavLink } from "react-router-dom";
import { Wallet, CreditCard, Home, User, LayoutDashboard } from "lucide-react";

const navItems = [
  { label: "Home", Icon: Home, to: "/" },
  { label: "Wallet", Icon: Wallet, to: "/wallet" },
  { label: "Card", Icon: CreditCard, to: "/upcoming" },
  { label: "Profile", Icon: User, to: "/profile" },
];

export default function Header() {
  return (
    <>
      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-teal-800 min-h-screen  sticky top-0 self-start p-6 gap-8">
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboard size={27} className="text-yellow-300" />
          <span className="text-white text-xl font-bold">MyBank</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, Icon, to }) => (
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

        <div className="mt-80 flex items-center gap-3 border-t border-teal-700 pt-6">
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">UserName</p>
            <p className="text-teal-300 text-xs">AccountType</p>
          </div>
        </div>
      </aside>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-50 shadow-lg">
        {navItems.map(({ label, Icon, to }) => (
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
