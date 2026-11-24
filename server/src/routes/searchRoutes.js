const express = require("express");
const { searchJobs } = require("../controllers/searchController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/jobs", protect, searchJobs);

module.exports = router;