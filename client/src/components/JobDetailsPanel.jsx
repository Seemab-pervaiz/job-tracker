import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Banknote,
  ExternalLink,
  CalendarDays,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

const STATUS_BADGE = {
  Wishlist: "bg-slate-100 text-slate-600",
  Applied: "bg-blue-50 text-blue-600",
  Interview: "bg-amber-50 text-amber-700",
  Offer: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

const fieldClass =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white";

const toDateInput = (value) => (value ? value.slice(0, 10) : "");

export default function JobDetailsPanel({ job, onClose, onSave, onEdit, onDelete }) {
  const [status, setStatus] = useState(job.status);
  const [appliedDate, setAppliedDate] = useState(toDateInput(job.appliedDate));
  const [interviewDate, setInterviewDate] = useState(
    toDateInput(job.interviewDate)
  );
  const [notes, setNotes] = useState(job.notes || "");
  const [saving, setSaving] = useState(false);

  // Escape dabane pe panel band
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const changed =
    status !== job.status ||
    appliedDate !== toDateInput(job.appliedDate) ||
    interviewDate !== toDateInput(job.interviewDate) ||
    notes !== (job.notes || "");

  const handleSave = async () => {
    setSaving(true);
    await onSave(job._id, { status, appliedDate, interviewDate, notes });
    setSaving(false);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${job.company} ${job.location || ""}`
  )}`;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0">
            {(job.company || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 leading-snug">{job.role}</h3>
            <p className="text-sm text-slate-500 truncate">{job.company}</p>
            <span
              className={`inline-block mt-2 text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_BADGE[job.status]}`}
            >
              {job.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-2 text-sm">
            {job.location && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:underline"
              >
                <MapPin size={16} /> {job.location} (Open in Maps)
              </a>
            )}
            {job.salary && (
              <div className="flex items-center gap-2 text-slate-600">
                <Banknote size={16} /> {job.salary}
              </div>
            )}
            {job.jobLink && (
              <a
                href={job.jobLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:underline"
              >
                <ExternalLink size={16} /> Open original job posting
              </a>
            )}
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <CalendarDays size={14} /> Added{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fieldClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Applied on
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Interview on
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              rows={7}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview prep, contact person, questions to ask, salary talk..."
              className={fieldClass}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 space-y-3">
          <button
            onClick={handleSave}
            disabled={!changed || saving}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
          >
            {saving && <Loader2 className="animate-spin" size={16} />}
            {saving ? "Saving..." : "Save changes"}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(job)}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg py-2"
            >
              <Pencil size={15} /> Edit all
            </button>
            <button
              onClick={() => onDelete(job)}
              className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg py-2"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}