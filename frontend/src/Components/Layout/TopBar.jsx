import { Bell, BellRing, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Contexts/useAuth";

export default function TopBar({
  title = "Bonjour",
  subtitle = "Welcome to myBank",
}) {
  const { hasNewActivity } = useAuth();
  return (
    <header className="bg-teal-700 lg:bg-white lg:border-b lg:border-gray-100 px-4 md:px-8 pt-10 lg:pt-0 pb-5 lg:py-4 flex items-center justify-between lg:sticky lg:top-0 lg:z-10">
      <div>
        <h1 className="text-white lg:text-gray-800 text-xl font-bold">
          {title}
        </h1>
        <p className="text-teal-200 lg:text-gray-400 text-sm">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <NavLink
          to="/notifications"
          className="text-white lg:text-gray-500 hover:text-teal-200 lg:hover:text-teal-600 transition-colors"
        >
          {hasNewActivity ? <BellRing size={22} /> : <Bell size={22} />}
        </NavLink>
        <NavLink
          to="/profile"
          className="text-white lg:text-gray-500 hover:text-teal-200 lg:hover:text-teal-600 transition-colors"
        >
          <Settings size={22} />
        </NavLink>
      </div>
    </header>
  );
}
