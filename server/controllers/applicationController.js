const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter: coverLetter || ""
    });

    const populatedApplication =
      await Application.findById(application._id)
        .populate(
          "job",
          "title company location salary jobType"
        )
        .populate(
          "applicant",
          "name email"
        );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get My Applications
const getMyApplications = async (req, res) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id
      })
        .populate(
          "job",
          "title company location salary jobType"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get Applicants for Employer's Job
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check job ownership
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applicants for this job"
      });
    }

    // Get applications
    const applications =
      await Application.find({
        job: jobId
      })
        .populate(
          "applicant",
          "name email"
        )
        .populate(
          "job",
          "title company location"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Selected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    // Find application
    const application =
      await Application.findById(applicationId)
        .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check job ownership
    if (
      application.job.employer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application"
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(applicationId)
        .populate(
          "applicant",
          "name email"
        )
        .populate(
          "job",
          "title company location"
        );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};