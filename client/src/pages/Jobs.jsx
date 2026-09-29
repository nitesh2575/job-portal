import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";

function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [location, setLocation] = useState(() => searchParams.get("location") || "");
  const [jobType, setJobType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/jobs", {
        params: {
          search,
          location,
          jobType
        }
      });

      setJobs(response.data.jobs || []);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load jobs"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, [search, location, jobType]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
  };

  return (
    <div className="container py-5">

      {/* Header */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          Find Your Dream Job 💼
        </h1>

        <p className="text-muted">
          Search thousands of jobs and find your next opportunity
        </p>

      </div>


      {/* Search & Filters */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* Search */}

            <div className="col-md-5">

              <label className="form-label fw-semibold">
                Search
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Job title or company"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* Location */}

            <div className="col-md-3">

              <label className="form-label fw-semibold">
                Location
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lucknow"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

            </div>


            {/* Job Type */}

            <div className="col-md-2">

              <label className="form-label fw-semibold">
                Job Type
              </label>

              <select
                className="form-select"
                value={jobType}
                onChange={(e) =>
                  setJobType(e.target.value)
                }
              >

                <option value="">
                  All
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
                </option>

              </select>

            </div>


            {/* Clear */}

            <div className="col-md-2 d-flex align-items-end">

              <button
                className="btn btn-secondary w-100"
                onClick={clearFilters}
              >
                Clear
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* Error */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {/* Loading */}

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="mt-3">
            Loading jobs...
          </p>

        </div>

      ) : (

        <>

          {/* Job Count */}

          <div className="mb-3">

            <strong>
              {jobs.length}
            </strong>{" "}
            jobs found

          </div>


          {/* No Jobs */}

          {jobs.length === 0 ? (

            <div className="text-center py-5">

              <h4>
                No jobs found 😕
              </h4>

              <p className="text-muted">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="row g-4">

              {jobs.map((job) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={job._id}
                >

                  <div className="card h-100 shadow-sm border-0">

                    <div className="card-body">

                      <div className="d-flex justify-content-between">

                        <h5 className="fw-bold">
                          {job.title}
                        </h5>

                        <span className="badge bg-primary">
                          {job.jobType}
                        </span>

                      </div>


                      <p className="mb-2">

                        🏢 {job.company}

                      </p>


                      <p className="text-muted mb-2">

                        📍 {job.location}

                      </p>


                      <p className="text-success fw-semibold">

                        💰 {job.salary}

                      </p>


                      <p className="text-muted">

                        {job.description?.length > 100
                          ? `${job.description.substring(
                            0,
                            100
                          )}...`
                          : job.description}

                      </p>


                      {/* Skills */}

                      <div className="mb-3">

                        {job.skills?.slice(0, 4).map(
                          (skill, index) => (

                            <span
                              key={index}
                              className="badge bg-light text-dark border me-1"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>


                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn btn-primary w-100"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </>

      )}

    </div>
  );
}

export default Jobs;