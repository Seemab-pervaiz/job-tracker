const Job = require("../models/Job");

// Nayi job banao
const createJob = async (req, res) => {
  try {
    const { company, role, jobLink } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    // Same link wali job dobara save na ho
    if (jobLink) {
      const exists = await Job.findOne({ user: req.user._id, jobLink });
      if (exists) {
        return res.status(409).json({ message: "You already saved this job" });
      }
    }

    const job = await Job.create({ ...req.body, user: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sirf apni jobs lo
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job edit karo (status change bhi yahi se hoga)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job delete karo
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard ke liye ginti
const getStats = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });

    const stats = {
      total: jobs.length,
      Wishlist: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    jobs.forEach((job) => {
      stats[job.status] += 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob, getStats };