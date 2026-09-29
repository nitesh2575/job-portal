import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";


function MyApplications() {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ======================================
  // Get Applications
  // ======================================

  const getApplications = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await API.get("/applications/my");

      setApplications(
        response.data.applications || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to load applications"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    getApplications();

  }, []);


  // ======================================
  // Loading
  // ======================================

  if (loading) {

    return (

      <div className="container text-center py-5">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading applications...
        </p>

      </div>

    );
  }


  return (

    <div className="container py-5">

      {/* Heading */}

      <div className="mb-4">

        <h1 className="fw-bold">
          📋 My Applications
        </h1>

        <p className="text-muted">
          Track the jobs you have applied for.
        </p>

      </div>


      {/* Error */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* No Applications */}

      {!error && applications.length === 0 && (

        <div className="card shadow-sm border-0">

          <div className="card-body text-center py-5">

            <div className="display-4">
              📭
            </div>

            <h4 className="mt-3">
              No applications yet
            </h4>

            <p className="text-muted">
              Start applying for jobs to see them here.
            </p>

            <Link
              to="/jobs"
              className="btn btn-primary"
            >
              Browse Jobs
            </Link>

          </div>

        </div>

      )}


      {/* Applications */}

      <div className="row g-4">

        {applications.map((application) => (

          <div
            className="col-md-6"
            key={application._id}
          >

            <div className="card shadow-sm border-0 h-100">

              <div className="card-body">


                {/* Job */}

                <h4 className="fw-bold">

                  {application.job?.title}

                </h4>


                {/* Company */}

                <p className="mb-2">

                  🏢 {application.job?.company}

                </p>


                {/* Location */}

                <p className="text-muted">

                  📍 {application.job?.location}

                </p>


                {/* Salary */}

                <p className="text-success fw-bold">

                  💰 {application.job?.salary}

                </p>


                {/* Job Type */}

                <span className="badge bg-primary me-2">

                  {application.job?.jobType}

                </span>


                {/* Status */}

                <div className="mt-4">

                  <strong>
                    Application Status:
                  </strong>

                  <span
                    className={`badge ms-2 ${
                      application.status === "Applied"
                        ? "bg-primary"
                        : application.status === "Shortlisted"
                        ? "bg-warning text-dark"
                        : application.status === "Selected"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {application.status}
                  </span>

                </div>


                {/* Applied Date */}

                <p className="text-muted mt-3 mb-3">

                  Applied on:{" "}

                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}

                </p>


                {/* View Job */}

                {application.job?._id && (

                  <Link
                    to={`/jobs/${application.job._id}`}
                    className="btn btn-outline-primary"
                  >
                    View Job
                  </Link>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}


export default MyApplications;