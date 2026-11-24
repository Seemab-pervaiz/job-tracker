import { useState } from "react";
import { X } from "lucide-react";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

const emptyForm = {
  company: "",
  role: "",
  status: "Wishlist",
  location: "",
  salary: "",
  jobLink: "",
  interviewDate: "",
  notes: "",
};

const inputClass =
  "w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500";

export default function JobModal({ onClose, onSave, job }) {
  const isEdit = Boolean(job);

  const [form, setForm] = useState(
    isEdit
      ? {
          company: job.company || "",
          role: job.role || "",
          status: job.status,
          location: job.location || "",
          salary: job.salary || "",
          jobLink: job.jobLink || "",
          interviewDate: job.interviewDate ? job.interviewDate.slice(0, 10) : "",
          notes: job.notes || "",
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {isEdit ? "Edit Job" : "Add Job"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="company" required placeholder="Company *" value={form.company} onChange={handleChange} className={inputClass} />
          <input name="role" required placeholder="Role *" value={form.role} onChange={handleChange} className={inputClass} />

          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className={inputClass} />
            <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className={inputClass} />
          </div>

          <input name="jobLink" placeholder="Job link" value={form.jobLink} onChange={handleChange} className={inputClass} />

          <div>
            <label className="block text-sm text-slate-600 mb-1">Interview date</label>
            <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange} className={inputClass} />
          </div>

          <textarea name="notes" rows={3} placeholder="Notes" value={form.notes} onChange={handleChange} className={inputClass} />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Job"}
          </button>
        </form>
      </div>
    </div>
  );
}