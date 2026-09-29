import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function JobDetails() {

  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();

  const [job, setJob] = useState(null);

  const [loadedJobId, setLoadedJobId] = useState(null);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitApplication = async (event) => {
    event.preventDefault();
    setApplicationError("");
    setSubmitting(true);

    try {
      await API.post("/applications", { jobId: id, coverLetter });
      setApplicationSubmitted(true);
    } catch (submitError) {
      setApplicationError(
        submitError.response?.data?.message || "Unable to submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    let active = true;

    const loadJob = async () => {
      try {
        const response = await API.get(`/jobs/${id}`);
        if (active) {
          setJob(response.data.job);
          setError("");
        }
      } catch (fetchError) {
        if (active) {
          console.error(fetchError);
          setError(fetchError.response?.data?.message || "Failed to load job");
        }
      } finally {
        if (active) setLoadedJobId(id);
      }
    };

    loadJob();
    return () => {
      active = false;
    };
  }, [id]);

  const loading = loadedJobId !== id;


  if (loading) {

    return (

      <div className="container text-center py-5">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading job...
        </p>

      </div>

    );

  }


  if (error) {

    return (

      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/jobs"
          className="btn btn-primary"
        >
          ← Back to Jobs
        </Link>

      </div>

    );

  }


  if (!job) {
    return null;
  }


  return (

    <div className="container py-5">

      <Link
        to="/jobs"
        className="btn btn-outline-secondary mb-4"
      >
        ← Back to Jobs
      </Link>


      <div className="card shadow-sm border-0">

        <div className="card-body p-4">


          {/* Job Header */}

          <div className="d-flex justify-content-between align-items-start mb-4">

            <div>

              <h1 className="fw-bold">
                {job.title}
              </h1>

              <h5 className="text-muted">
                🏢 {job.company}
              </h5>

            </div>


            <span className="badge bg-primary fs-6">

              {job.jobType}

            </span>

          </div>


          <hr />


          {/* Job Information */}

          <div className="row mb-4">

            <div className="col-md-4">

              <strong>
                📍 Location
              </strong>

              <p className="text-muted">
                {job.location}
              </p>

            </div>


            <div className="col-md-4">

              <strong>
                💰 Salary
              </strong>

              <p className="text-success">
                {job.salary}
              </p>

            </div>


            <div className="col-md-4">

              <strong>
                👤 Employer
              </strong>

              <p className="text-muted">
                {job.employer?.name}
              </p>

            </div>

          </div>


          {/* Description */}

          <h4 className="fw-bold">
            Job Description
          </h4>

          <p className="text-muted">
            {job.description}
          </p>


          {/* Skills */}

          <h4 className="fw-bold mt-4">
            Required Skills
          </h4>

          <div className="mb-4">

            {job.skills?.map(
              (skill, index) => (

                <span
                  key={index}
                  className="badge bg-light text-dark border me-2 mb-2 p-2"
                >
                  {skill}
                </span>

              )
            )}

          </div>


          {/* Employer */}

          <h4 className="fw-bold">
            Employer Information
          </h4>

          <p className="mb-1">

            <strong>
              Name:
            </strong>{" "}
            {job.employer?.name}

          </p>

          <p>

            <strong>
              Email:
            </strong>{" "}
            {job.employer?.email}

          </p>


          {/* Apply Button */}

          <section className="application-panel mt-4" aria-labelledby="apply-heading">
            <h4 className="fw-bold" id="apply-heading">Interested in this role?</h4>
            {applicationSubmitted ? (
              <div className="alert alert-success mb-0" role="status">
                Your application has been submitted.
              </div>
            ) : user?.role === "jobseeker" ? (
              <form onSubmit={submitApplication}>
                <label className="form-label" htmlFor="cover-letter">
                  Cover letter <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  id="cover-letter"
                  className="form-control mb-3"
                  rows="5"
                  maxLength="4000"
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Share a few details about your experience and interest."
                />
                {applicationError && (
                  <div className="alert alert-danger" role="alert">
                    {applicationError}
                  </div>
                )}
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              </form>
            ) : isLoggedIn ? (
              <p className="text-muted mb-0">Employer accounts cannot apply for jobs.</p>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: `/jobs/${id}` } }}
                className="btn btn-primary"
              >
                Sign in to apply
              </Link>
            )}
          </section>

        </div>

      </div>

    </div>

  );
}

export default JobDetails;