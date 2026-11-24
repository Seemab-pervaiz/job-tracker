import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Send,
  CalendarClock,
  Trophy,
  XCircle,
  Search,
  ClipboardList,
  ArrowRight,
  MapPin,
  BellRing,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

const STATUS_COLORS = {
  Wishlist: "#94a3b8",
  Applied: "#3b82f6",
  Interview: "#f59e0b",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

const STATUS_BADGE = {
  Wishlist: "bg-slate-100 text-slate-600",
  Applied: "bg-blue-50 text-blue-600",
  Interview: "bg-amber-50 text-amber-700",
  Offer: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

const DAY = 86400000;
const FOLLOW_UP_AFTER_DAYS = 7;

const tooltipStyle = {
  background: "var(--toast-bg)",
  color: "var(--toast-text)",
  border: "1px solid var(--color-slate-200)",
  borderRadius: 8,
  fontSize: 12,
};

const axisTick = { fill: "var(--color-slate-500)", fontSize: 12 };

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function daysLeft(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `in ${diff} days`;
}

export default function Overview() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch (err) {
        setError("Could not load your data");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const countOf = (status) => jobs.filter((j) => j.status === status).length;

  const stats = [
    { label: "Total jobs", value: jobs.length, icon: Briefcase, color: "bg-slate-100 text-slate-700" },
    { label: "Applied", value: countOf("Applied"), icon: Send, color: "bg-blue-50 text-blue-600" },
    { label: "Interviews", value: countOf("Interview"), icon: CalendarClock, color: "bg-amber-50 text-amber-600" },
    { label: "Offers", value: countOf("Offer"), icon: Trophy, color: "bg-green-50 text-green-600" },
    { label: "Rejected", value: countOf("Rejected"), icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = jobs
    .filter((j) => j.interviewDate && new Date(j.interviewDate) >= today)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 4);

  const recent = jobs.slice(0, 5);

  // Follow-up: Applied hai aur 7+ din ho gaye
  const followUps = jobs
    .filter((j) => j.status === "Applied")
    .map((j) => {
      const since = new Date(j.appliedDate || j.createdAt);
      return { ...j, daysAgo: Math.floor((Date.now() - since) / DAY) };
    })
    .filter((j) => j.daysAgo >= FOLLOW_UP_AFTER_DAYS)
    .sort((a, b) => b.daysAgo - a.daysAgo)
    .slice(0, 3);

  // Donut chart data (sirf wo status jinme jobs hon)
  const pieData = STATUSES.map((s) => ({ name: s, value: countOf(s) })).filter(
    (d) => d.value > 0
  );

  // Pichle 6 hafte: har hafte mein kitni jobs add hui
  const weekly = [];
  for (let i = 5; i >= 0; i--) {
    weekly.push({ label: i === 0 ? "This week" : `${i}w ago`, count: 0 });
  }
  jobs.forEach((j) => {
    const diff = Math.floor((Date.now() - new Date(j.createdAt)) / (7 * DAY));
    if (diff >= 0 && diff <= 5) weekly[5 - diff].count += 1;
  });

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <div className="max-w-6xl">
      {/* Hero */}
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}, {firstName} 👋
        </h2>
        <p className="mt-2 text-indigo-100">
          {jobs.length === 0
            ? "Start by finding jobs in your field."
            : `You are tracking ${jobs.length} ${
                jobs.length === 1 ? "job" : "jobs"
              }${
                upcoming.length > 0
                  ? ` and have ${upcoming.length} upcoming ${
                      upcoming.length === 1 ? "interview" : "interviews"
                    }.`
                  : "."
              }`}
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            to="/find-jobs"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
          >
            <Search size={16} /> Find Jobs
          </Link>
          <Link
            to="/applications"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
          >
            <ClipboardList size={16} /> My Applications
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {stats.map(({ label, value, icon: Icon, color }, idx) => (
              <div
                key={label}
                className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition ${
                  idx === 0 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}
                >
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <Search className="mx-auto text-slate-300 mb-3" size={40} />
              <h3 className="font-semibold text-slate-700">
                No applications yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                Search jobs in your field and save the ones you like.
              </p>
              <Link
                to="/find-jobs"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5"
              >
                Find your first job <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Applications by status
                  </h3>
                  <div className="h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {pieData.map((d) => (
                            <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-slate-800">
                        {jobs.length}
                      </span>
                      <span className="text-xs text-slate-500">total</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
                    {STATUSES.map((s) => (
                      <div key={s} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: STATUS_COLORS[s] }}
                        />
                        {s} ({countOf(s)})
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Jobs added per week
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekly}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-slate-200)"
                        />
                        <XAxis
                          dataKey="label"
                          tick={axisTick}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={axisTick}
                          axisLine={false}
                          tickLine={false}
                          width={28}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          cursor={{ fill: "var(--color-slate-100)" }}
                        />
                        <Bar
                          dataKey="count"
                          name="Jobs"
                          fill="#6366f1"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Follow-up reminder */}
              {followUps.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                  <h3 className="font-semibold text-blue-700 flex items-center gap-2 mb-3">
                    <BellRing size={18} /> Time to follow up
                  </h3>
                  <div className="space-y-2">
                    {followUps.map((job) => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2.5 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {job.company}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {job.role}
                          </p>
                        </div>
                        <span className="text-xs text-blue-600 shrink-0">
                          Applied {job.daysAgo} days ago
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    You applied a week or more ago. A short follow-up email can
                    help your application stand out.
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Upcoming interviews */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <CalendarClock size={18} className="text-amber-600" />
                    Upcoming interviews
                  </h3>
                  {upcoming.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4">
                      No interviews scheduled. Add an interview date to a job
                      and it will show up here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((job) => (
                        <div
                          key={job._id}
                          className="flex items-center justify-between gap-3 bg-amber-50 rounded-lg px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                              {job.company}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {job.role}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-amber-700">
                              {daysLeft(job.interviewDate)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(job.interviewDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent applications */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <ClipboardList size={18} className="text-indigo-600" />
                      Recent applications
                    </h3>
                    <Link
                      to="/applications"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recent.map((job) => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {job.company}
                          </p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                            {job.role}
                            {job.location && (
                              <>
                                <span>·</span>
                                <MapPin size={11} /> {job.location}
                              </>
                            )}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium rounded-full px-2.5 py-1 shrink-0 ${STATUS_BADGE[job.status]}`}
                        >
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}