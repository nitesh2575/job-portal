const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");


// My Applications
router.get(
  "/my",
  protect,
  authorizeRole("jobseeker"),
  getMyApplications
);


// Get applicants for a job
router.get(
  "/job/:jobId",
  protect,
  authorizeRole("employer"),
  getJobApplicants
);


// Update application status
router.put(
  "/:applicationId/status",
  protect,
  authorizeRole("employer"),
  updateApplicationStatus
);


// Apply for job
router.post(
  "/",
  protect,
  authorizeRole("jobseeker"),
  applyForJob
);


module.exports = router;