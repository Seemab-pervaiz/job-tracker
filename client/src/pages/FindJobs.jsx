import { useEffect, useState } from "react";
import { Search, MapPin, Loader2, SearchX } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import SearchJobCard from "../components/SearchJobCard";

const inputClass =
  "w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white";

export default function FindJobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Wah Cantt");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [savedLinks, setSavedLinks] = useState(new Set());
  const [savingId, setSavingId] = useState(null);

  // Page khulte hi pata karo kaunsi jobs pehle se saved hain
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const { data } = await API.get("/jobs");
        setSavedLinks(new Set(data.map((j) => j.jobLink).filter(Boolean)));
      } catch (err) {
        console.error(err);
      }
    };
    loadSaved();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/search/jobs", {
        params: { query, location },
      });
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed, try again");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job) => {
    setSavingId(job.id);
    try {
      await API.post("/jobs", {
        company: job.company || "Unknown company",
        role: job.role,
        status: "Wishlist",
        location: job.location,
        salary: job.salary,
        jobLink: job.applyLink,
        notes: job.source ? `Found via ${job.source}` : "",
      });
      setSavedLinks((prev) => new Set(prev).add(job.applyLink));
      toast.success("Saved to your Wishlist");
    } catch (err) {
      if (err.response?.status === 409) {
        setSavedLinks((prev) => new Set(prev).add(job.applyLink));
        toast("You already saved this job", { icon: "ℹ️" });
      } else {
        toast.error(err.response?.data?.message || "Could not save job");
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Find Jobs</h2>
      <p className="text-slate-500 mt-1 mb-6">
        Search any field in any city, then save the jobs you like to your tracker.
      </p>

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title or field (e.g. teaching, web developer)"
            className={inputClass}
          />
        </div>

        <div className="relative md:w-64">
          <MapPin
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City (e.g. Wah Cantt)"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded mt-5" />
              <div className="h-3 bg-slate-200 rounded mt-2 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {!loading && !searched && !error && (
        <div className="text-center text-slate-400 py-16">
          <Search className="mx-auto mb-3" size={36} />
          <p>Type a job title and city, then press Search.</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="text-center text-slate-400 py-16">
          <SearchX className="mx-auto mb-3" size={36} />
          <p>No jobs found. Try a different keyword or a nearby city.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {results.length} jobs found
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((job, i) => (
              <SearchJobCard
                key={job.id || i}
                job={job}
                saved={savedLinks.has(job.applyLink)}
                saving={savingId === job.id}
                onSave={handleSave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}