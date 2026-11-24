import { Trash2, Pencil, MapPin, Banknote, CalendarDays } from "lucide-react";

export default function JobCard({ job, onDelete, onEdit, onOpen }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${job.company} ${job.location || ""}`
  )}`;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      onClick={() => onOpen(job)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">
            {job.company}
          </h4>
          <p className="text-sm text-slate-500 line-clamp-2">{job.role}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={(e) => {
              stop(e);
              onEdit(job);
            }}
            className="text-slate-400 hover:text-indigo-600"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              stop(e);
              onDelete(job);
            }}
            className="text-slate-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        {job.location && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            className="flex items-center gap-1 text-indigo-600 hover:underline min-w-0"
          >
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{job.location}</span>
            <span className="shrink-0 text-[11px] text-indigo-400">(Maps)</span>
          </a>
        )}
        {job.salary && (
          <div className="flex items-center gap-1 min-w-0">
            <Banknote size={12} className="shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        )}
        {job.interviewDate && (
          <div className="flex items-center gap-1 text-amber-600 min-w-0">
            <CalendarDays size={12} className="shrink-0" />
            <span className="truncate">
              Interview: {new Date(job.interviewDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}