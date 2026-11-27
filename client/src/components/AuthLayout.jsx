import {
  Briefcase,
  Search,
  ClipboardList,
  BellRing,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: Search, text: "Search jobs by field and city" },
  { icon: ClipboardList, text: "Track every application on a kanban board" },
  { icon: BellRing, text: "Never miss an interview or a follow-up" },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#090d16] text-white">
      {/* Left: brand panel with rich warm brown/espresso gradient */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-8 xl:p-14 select-none min-h-screen"
        style={{
          background:
            "radial-gradient(circle at 10% 15%, #78350f 0%, transparent 50%), radial-gradient(circle at 90% 85%, #542a12 0%, transparent 45%), linear-gradient(135deg, #451a03 0%, #2a1105 45%, #140803 100%)",
        }}
      >
        {/* Subtle ambient glowing orbs in warm brown */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#78350f]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#451a03]/30 blur-3xl pointer-events-none" />

        {/* Brand logo at top */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#854d0e] to-[#542a12] flex items-center justify-center shadow-lg shadow-[#140803]/60 border border-white/10">
            <Briefcase size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            JobTracker
          </span>
        </div>

        {/* Center content: Clean centered pitch & features */}
        <div className="relative z-20 my-auto text-center max-w-lg mx-auto py-8 w-full">
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.18] text-white tracking-tight">
            Your job search,
            <br />
            finally organised.
          </h2>
          <p className="mt-4 text-white/80 text-sm xl:text-base leading-relaxed max-w-md mx-auto">
            Find jobs in your field and city, save them in one place, and
            follow every application from wishlist to offer.
          </p>

          <ul className="mt-8 space-y-3.5 max-w-sm mx-auto text-left">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xs hover:bg-white/10 transition"
              >
                <span className="w-8 h-8 rounded-lg bg-[#78350f] flex items-center justify-center shadow-xs shrink-0 border border-white/10">
                  <Icon size={16} className="text-white" />
                </span>
                <span className="text-white/95 text-sm font-medium">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Empty bottom element for flex justify-between vertical balance */}
        <div />
      </div>

      {/* Right: form section */}
      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-[#090d16]">
        {/* Toggle dark mode button */}
        <button
          onClick={toggle}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
          title="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-[390px]">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#854d0e] to-[#542a12] flex items-center justify-center shadow-md border border-white/10">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              JobTracker
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-slate-400 text-sm mt-2 mb-8">{subtitle}</p>

          {children}

          <div className="text-center text-sm text-slate-400 mt-7">{footer}</div>
        </div>
      </div>
    </div>
  );
}
