const Job = require("../models/Job");

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      description,
      skills
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, company, location, salary and description are required"
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      description,
      skills,
      employer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// GET ALL JOBS + SEARCH + FILTER
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType
    } = req.query;

    let filter = {};

    // Search by title or company
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          company: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Location filter
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter)
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// GET SINGLE JOB
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("employer", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// GET EMPLOYER JOBS
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      employer: req.user._id
    })
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const updateJob = async (req, res) => {
  try {
    const editableFields = [
      "title",
      "company",
      "location",
      "salary",
      "jobType",
      "description",
      "skills"
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => editableFields.includes(field))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one job field to update"
      });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not authorized to update it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employer: req.user._id
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not authorized to delete it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob
};