import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function Applicants() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getApplicants = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/applications/job/${jobId}`
      );

      setApplications(res.data.applications);

      if (res.data.applications.length > 0) {
        setJob(res.data.applications[0].job);
      }

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load applicants"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getApplicants();
  }, [jobId]);


  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      await API.put(
        `/applications/${applicationId}/status`,
        {
          status
        }
      );

      alert(
        "Application status updated successfully"
      );

      getApplicants();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update status"
      );
    }
  };


  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading applicants...</h3>
      </div>
    );
  }


  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/employer/dashboard"
          className="btn btn-dark"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }


  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            Applicants
          </h2>

          {job && (
            <p className="text-muted mb-0">
              {job.title} - {job.company}
            </p>
          )}
        </div>

        <Link
          to="/employer/dashboard"
          className="btn btn-dark"
        >
          Back to Dashboard
        </Link>

      </div>


      {applications.length === 0 ? (

        <div className="alert alert-info">
          No applicants have applied for this job yet.
        </div>

      ) : (

        <div className="row">

          {applications.map((application) => (

            <div
              className="col-md-6 mb-4"
              key={application._id}
            >

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="fw-bold">
                    {application.applicant?.name}
                  </h5>

                  <p className="mb-1">
                    <strong>Email:</strong>{" "}
                    {application.applicant?.email}
                  </p>

                  <p className="mb-1">
                    <strong>Applied:</strong>{" "}
                    {new Date(
                      application.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="mb-3">
                    <strong>Status:</strong>{" "}

                    <span
                      className={`badge ${
                        application.status === "Selected"
                          ? "bg-success"
                          : application.status === "Shortlisted"
                          ? "bg-warning text-dark"
                          : application.status === "Rejected"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                    >
                      {application.status}
                    </span>
                  </p>


                  {application.coverLetter && (
                    <div className="mb-3">

                      <strong>
                        Cover Letter:
                      </strong>

                      <p className="mt-2 text-muted">
                        {application.coverLetter}
                      </p>

                    </div>
                  )}


                  <div className="d-flex gap-2 flex-wrap">

                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        updateStatus(
                          application._id,
                          "Shortlisted"
                        )
                      }
                    >
                      Shortlist
                    </button>


                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateStatus(
                          application._id,
                          "Selected"
                        )
                      }
                    >
                      Select
                    </button>


                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        updateStatus(
                          application._id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
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

export default Applicants;