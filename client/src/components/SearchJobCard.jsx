import { useState } from "react";
import {
  MapPin,
  Banknote,
  CalendarDays,
  ExternalLink,
  BookmarkPlus,
  Check,
  Loader2,
} from "lucide-react";

export default function SearchJobCard({ job, saved, saving, onSave }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${job.company || ""} ${job.location || ""}`
  )}`;

  const initial = (job.company || "?").charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition flex flex-col">
      <div className="flex items-start gap-3">
        {job.logo && !logoFailed ? (
          <img
            src={job.logo}
            alt=""
            onError={() => setLogoFailed(true)}
            className="w-11 h-11 rounded-lg object-contain border border-slate-100 bg-white shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0">
            {initial}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 leading-snug line-clamp-2">
            {job.role}
          </h3>
          <p className="text-sm text-slate-500 truncate">{job.company}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {job.type && (
          <span className="bg-indigo-50 text-indigo-600 rounded-full px-2.5 py-1">
            {job.type}
          </span>
        )}
        {job.source && (
          <span className="bg-slate-100 text-slate-500 rounded-full px-2.5 py-1">
            via {job.source}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        {job.location && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:underline"
          >
            <MapPin size={12} /> {job.location}
          </a>
        )}
        {job.salary && (
          <div className="flex items-center gap-1">
            <Banknote size={12} /> {job.salary}
          </div>
        )}
        {job.postedAt && (
          <div className="flex items-center gap-1">
            <CalendarDays size={12} /> Posted{" "}
            {new Date(job.postedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {job.description && (
        <p className="mt-3 text-sm text-slate-500 line-clamp-3">
          {job.description}
        </p>
      )}

      <div className="flex-1" />

      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
        <a
          href={job.applyLink}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2"
        >
          Apply <ExternalLink size={14} />
        </a>
        <button
          onClick={() => onSave(job)}
          disabled={saved || saving}
          className={`flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 border ${
            saved
              ? "bg-green-50 border-green-200 text-green-700"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          } disabled:opacity-80`}
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : (
            <BookmarkPlus size={14} />
          )}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}