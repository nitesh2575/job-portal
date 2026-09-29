const employerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.role !== "employer") {
        return res.status(403).json({
            success: false,
            message: "Employer account required"
        });
    }

    return next();
};

module.exports = employerOnly;