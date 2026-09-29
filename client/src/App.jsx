import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import Applicants from "./pages/Applicants";
import CreateJob from "./pages/CreateJob";
import Home from "./pages/Home";

import RoleRoute from "./routes/RoleRoute";

function App() {
  const {
    user,
    isLoggedIn,
    logout
  } = useAuth();

  return (
    <BrowserRouter>

      {/* Navbar */}

      <nav className="navbar navbar-dark bg-dark">
        <div className="container">

          <Link
            to="/"
            className="navbar-brand fw-bold"
          >
            💼 Job Portal
          </Link>

          <div className="d-flex gap-2 align-items-center">

            <Link
              to="/jobs"
              className="btn btn-outline-light"
            >
              Browse Jobs
            </Link>


            {/* Job Seeker Menu */}

            {isLoggedIn &&
              user?.role === "jobseeker" && (
                <Link
                  to="/my-applications"
                  className="btn btn-outline-light"
                >
                  My Applications
                </Link>
              )}


            {/* Employer Menu */}

            {isLoggedIn &&
              user?.role === "employer" && (
                <Link
                  to="/employer/dashboard"
                  className="btn btn-outline-light"
                >
                  Employer Dashboard
                </Link>
              )}


            {/* Login/Register */}

            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-success"
                >
                  Register
                </Link>
              </>
            )}


            {/* Logged-in User */}

            {isLoggedIn && (
              <>
                <span className="text-white">
                  Hi, {user?.name}
                </span>

                <button
                  className="btn btn-danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </nav>


      {/* Routes */}

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* Public Routes */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Job Seeker Protected Route */}

        <Route
          path="/my-applications"
          element={
            <RoleRoute role="jobseeker">
              <MyApplications />
            </RoleRoute>
          }
        />


        {/* Employer Protected Route */}

        <Route
          path="/employer/dashboard"
          element={
            <RoleRoute role="employer">
              <EmployerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/create"
          element={
            <RoleRoute role="employer">
              <CreateJob />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/:id/edit"
          element={
            <RoleRoute role="employer">
              <CreateJob />
            </RoleRoute>
          }
        />


        {/* Employer Applicants */}

        <Route
          path="/employer/jobs/:jobId/applicants"
          element={
            <RoleRoute role="employer">
              <Applicants />
            </RoleRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;