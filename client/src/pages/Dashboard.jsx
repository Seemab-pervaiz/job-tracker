import { useEffect, useState } from "react";
import { Plus, Search, CalendarDays } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import API from "../api/axios";
import StatsCard from "../components/StatsCard";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import ConfirmModal from "../components/ConfirmModal";
import JobDetailsPanel from "../components/JobDetailsPanel";

const COLUMNS = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  // Panel ke liye job hamesha latest list se aati hai
  const selectedJob = jobs.find((j) => j._id === selectedId);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load your jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleAdd = async (form) => {
    try {
      const { data } = await API.post("/jobs", form);
      setJobs([data, ...jobs]);
      setShowModal(false);
      toast.success("Job added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add job");
    }
  };

  const handleUpdate = async (form) => {
    try {
      const { data } = await API.put(`/jobs/${editingJob._id}`, form);
      setJobs(jobs.map((job) => (job._id === data._id ? data : job)));
      setEditingJob(null);
      toast.success("Job updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update job");
    }
  };

  // Panel se: status, dates, notes save
  const handlePanelSave = async (id, changes) => {
    try {
      const { data } = await API.put(`/jobs/${id}`, changes);
      setJobs((prev) => prev.map((job) => (job._id === data._id ? data : job)));
      toast.success("Changes saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save changes");
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget._id;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Could not delete job");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const previousJobs = jobs;

    setJobs(
      jobs.map((job) =>
        job._id === draggableId ? { ...job, status: newStatus } : job
      )
    );

    try {
      await API.put(`/jobs/${draggableId}`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch (error) {
      setJobs(previousJobs);
      toast.error("Could not move job");
    }
  };

  const countOf = (status) => jobs.filter((j) => j.status === status).length;

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingInterviews = jobs
    .filter((job) => job.interviewDate && new Date(job.interviewDate) >= today)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

  return (
    <div>
      <main>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 self-start sm:self-auto"
          >
            <Plus size={18} /> Add Job
          </button>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
              <StatsCard label="Total" value={jobs.length} color="text-slate-800" className="col-span-2 sm:col-span-1" />
              <StatsCard label="Applied" value={countOf("Applied")} color="text-blue-600" />
              <StatsCard label="Interview" value={countOf("Interview")} color="text-amber-600" />
              <StatsCard label="Offer" value={countOf("Offer")} color="text-green-600" />
              <StatsCard label="Rejected" value={countOf("Rejected")} color="text-red-600" />
            </div>

            {upcomingInterviews.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
                  <CalendarDays size={18} /> Upcoming Interviews
                </h3>
                <div className="space-y-2">
                  {upcomingInterviews.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-slate-800">
                        {job.company}{" "}
                        <span className="text-slate-500 font-normal">
                          ({job.role})
                        </span>
                      </span>
                      <span className="text-amber-700">
                        {new Date(job.interviewDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start">
                {COLUMNS.map((column) => {
                  const columnJobs = filteredJobs.filter(
                    (job) => job.status === column
                  );

                  return (
                    <div key={column} className="w-72 min-w-[270px] flex-1 shrink-0 bg-slate-100 rounded-xl p-3">
                      <h3 className="font-semibold text-slate-700 mb-3 flex items-center justify-between">
                        {column}
                        <span className="text-xs bg-white rounded-full px-2 py-0.5 text-slate-500">
                          {columnJobs.length}
                        </span>
                      </h3>

                      <Droppable droppableId={column}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[120px] rounded-lg transition ${
                              snapshot.isDraggingOver ? "bg-indigo-100" : ""
                            }`}
                          >
                            {columnJobs.map((job, index) => (
                              <Draggable
                                key={job._id}
                                draggableId={job._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 ${
                                      snapshot.isDragging
                                        ? "rotate-2 opacity-90"
                                        : ""
                                    }`}
                                  >
                                    <JobCard
                                      job={job}
                                      onOpen={(j) => setSelectedId(j._id)}
                                      onDelete={setDeleteTarget}
                                      onEdit={setEditingJob}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {columnJobs.length === 0 &&
                              !snapshot.isDraggingOver && (
                                <p className="text-xs text-slate-400 text-center py-4">
                                  No jobs here yet
                                </p>
                              )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </>
        )}
      </main>

      {selectedJob && (
        <JobDetailsPanel
          key={selectedJob._id + selectedJob.updatedAt}
          job={selectedJob}
          onClose={() => setSelectedId(null)}
          onSave={handlePanelSave}
          onEdit={(job) => {
            setSelectedId(null);
            setEditingJob(job);
          }}
          onDelete={(job) => {
            setSelectedId(null);
            setDeleteTarget(job);
          }}
        />
      )}

      {showModal && (
        <JobModal onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}

      {editingJob && (
        <JobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete this job?"
          message={`${deleteTarget.company} - ${deleteTarget.role} will be removed permanently.`}
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}