const express = require("express");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getStats,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/stats", getStats);
router.route("/").get(getJobs).post(createJob);
router.route("/:id").put(updateJob).delete(deleteJob);

module.exports = router;