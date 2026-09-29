const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const employerOnly = require("../middleware/employerOnly");


// Get all jobs
router.get("/", getJobs);


// Get employer's jobs
router.get("/my-jobs", protect, employerOnly, getMyJobs);


// Get single job
router.get("/:id", getJobById);


// Create job
router.post("/", protect, employerOnly, createJob);


// Update or delete a job owned by the authenticated employer
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);


module.exports = router;