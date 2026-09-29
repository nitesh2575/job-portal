import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (location.trim()) params.set("location", location.trim());
        navigate(`/jobs${params.size ? `?${params.toString()}` : ""}`);
    };

    return (
        <main className="home-shell">
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h1 className="home-heading">
                Find work that fits <span>your next move.</span>
            </h1>
            <p className="home-copy">
                Search open roles by title, company, or location and find an opportunity worth pursuing.
            </p>

            <form className="home-search" onSubmit={handleSearch}>
                <div>
                    <label className="form-label" htmlFor="home-search">Job title or company</label>
                    <input
                        id="home-search"
                        className="form-control"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="e.g. Product designer"
                    />
                </div>
                <div>
                    <label className="form-label" htmlFor="home-location">Location</label>
                    <input
                        id="home-location"
                        className="form-control"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="City or remote"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Search jobs</button>
            </form>

            <nav className="home-links" aria-label="Quick links">
                <Link to="/jobs">Browse all jobs</Link>
                {user?.role === "employer" && <Link to="/jobs/create">Post a job</Link>}
                {!user && <Link to="/register">Create an account</Link>}
            </nav>
        </main>
    );
}

export default Home;