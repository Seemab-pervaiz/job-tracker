import { NavLink } from "react-router-dom";
import {
  Briefcase,
  LayoutDashboard,
  Search,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/find-jobs", label: "Find Jobs", icon: Search },
  { to: "/applications", label: "My Applications", icon: ClipboardList },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-600 hover:bg-slate-100"
  }`;

const logoBox =
  "bg-linear-to-br from-indigo-500 to-cyan-500 rounded-lg shadow-sm";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-200">
          <div className={`${logoBox} p-2`}>
            <Briefcase className="text-white" size={18} />
          </div>
          <span className="font-bold text-slate-800 text-lg">JobTracker</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>

          <div className="px-3 pt-2">
            <p className="text-sm font-medium text-slate-700 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className={`${logoBox} p-1.5`}>
              <Briefcase className="text-white" size={16} />
            </div>
            <span className="font-bold text-slate-800">JobTracker</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={toggle} className="hover:text-indigo-600">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={logout} className="hover:text-red-600">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 px-2 pb-2 overflow-x-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}