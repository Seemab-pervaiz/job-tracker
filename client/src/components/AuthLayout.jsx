import { Briefcase, Search, ClipboardList, BellRing, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: Search, text: "Search jobs by field and city" },
  { icon: ClipboardList, text: "Track every application on a kanban board" },
  { icon: BellRing, text: "Never miss an interview or a follow-up" },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left: brand panel (sirf bari screen pe) */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-amber-700 via-amber-800 to-stone-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl">
            <Briefcase size={22} />
          </div>
          <span className="text-xl font-bold">JobTracker</span>
        </div>

        <div className="my-auto">
          <h2 className="text-4xl font-bold leading-tight">
            Your job search,
            <br />
            finally organised.
          </h2>
          <p className="mt-4 text-amber-100 max-w-md">
            Find jobs in your field and city, save them in one place, and
            follow every application from wishlist to offer.
          </p>

          <ul className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg">
                  <Icon size={18} />
                </span>
                <span className="text-amber-50">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: form */}
      <div className="relative flex items-center justify-center p-6">
        <button
          onClick={toggle}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          title="Toggle dark mode"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-linear-to-br from-amber-600 to-stone-800 p-2 rounded-lg">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="font-bold text-slate-800 text-lg">JobTracker</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-2 mb-8">{subtitle}</p>

          {children}

          <p className="text-center text-sm text-slate-500 mt-8">{footer}</p>
        </div>
      </div>
    </div>
  );
}