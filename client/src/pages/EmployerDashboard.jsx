import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";


function EmployerDashboard() {

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [deletingJobId, setDeletingJobId] = useState("");

    const deleteJob = async (job) => {
        if (!window.confirm(`Delete "${job.title}"? This action cannot be undone.`)) return;

        setDeletingJobId(job._id);
        setError("");
        try {
            await API.delete(`/jobs/${job._id}`);
            setJobs((currentJobs) => currentJobs.filter((item) => item._id !== job._id));
        } catch (deleteError) {
            setError(deleteError.response?.data?.message || "Failed to delete this job");
        } finally {
            setDeletingJobId("");
        }
    };


    // ==============================
    // Get Employer Jobs
    // ==============================

    const getMyJobs = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await API.get("/jobs/my-jobs");

            setJobs(response.data.jobs || []);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load your jobs"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getMyJobs();

    }, []);


    // ==============================
    // Loading
    // ==============================

    if (loading) {

        return (
            <div className="container text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3">
                    Loading dashboard...
                </p>

            </div>
        );
    }


    return (

        <div className="container py-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold">
                        👨‍💼 Employer Dashboard
                    </h1>

                    <p className="text-muted">
                        Manage your posted jobs.
                    </p>

                </div>


                <Link
                    to="/jobs/create"
                    className="btn btn-primary"
                >
                    + Post New Job
                </Link>

            </div>


            {/* Error */}

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}


            {/* Statistics */}

            <div className="row g-4 mb-5">

                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Jobs
                            </h6>

                            <h2 className="fw-bold">
                                {jobs.length}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Active Jobs
                            </h6>

                            <h2 className="fw-bold text-success">
                                {jobs.length}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Posted Jobs
                            </h6>

                            <h2 className="fw-bold text-primary">
                                {jobs.length}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* Jobs */}

            <h3 className="fw-bold mb-3">
                My Posted Jobs
            </h3>


            {jobs.length === 0 ? (

                <div className="card shadow-sm border-0">

                    <div className="card-body text-center py-5">

                        <div className="display-4">
                            📭
                        </div>

                        <h4 className="mt-3">
                            No jobs posted yet
                        </h4>

                        <p className="text-muted">
                            Create your first job posting.
                        </p>

                        <Link
                            to="/jobs/create"
                            className="btn btn-primary"
                        >
                            Post a Job
                        </Link>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {jobs.map((job) => (

                        <div
                            className="col-md-6"
                            key={job._id}
                        >

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body">

                                    <h4 className="fw-bold">
                                        {job.title}
                                    </h4>

                                    <p>
                                        🏢 {job.company}
                                    </p>

                                    <p className="text-muted">
                                        📍 {job.location}
                                    </p>

                                    <p className="text-success fw-bold">
                                        💰 {job.salary}
                                    </p>

                                    <span className="badge bg-primary">
                                        {job.jobType}
                                    </span>

                                    <p className="text-muted mt-3">

                                        {job.description.length > 120
                                            ? job.description.substring(0, 120) + "..."
                                            : job.description}

                                    </p>


                                    <div className="d-flex gap-2 mt-3">

                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="btn btn-outline-primary"
                                        >
                                            View Job
                                        </Link>

                                        <Link
                                            to={`/employer/jobs/${job._id}/applicants`}
                                            className="btn btn-primary"
                                        >
                                            Applicants
                                        </Link>

                                        <Link
                                            to={`/jobs/${job._id}/edit`}
                                            className="btn btn-outline-secondary"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => deleteJob(job)}
                                            disabled={deletingJobId === job._id}
                                        >
                                            {deletingJobId === job._id ? "Deleting..." : "Delete"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}


export default EmployerDashboard;