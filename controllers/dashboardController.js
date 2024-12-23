const Application = require("../models/application");
const Company = require("../models/company");
const Job = require("../models/job");

const getDashboardData = async (req, res, next) => {
  try {
    if (req.role === "admin") {
      const applications = await Application.find({ applicant: req.userId });
      const totalApplications = applications.length;

      return res.status(200).json({ totalApplications });
    }

    if (req.role === "employer") {
      const company = await Company.findOne({ user: req.userId });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const jobs = await Job.find({ company: company._id });
      const totalJobs = jobs.length;

      const applications = await Application.find({ company: company._id });
      const totalApplications = applications.length;

      return res.status(200).json({
        totalJobs,
        totalApplications
      });

    }

    return res.status(403).json({ message: "Unauthorized" });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardData
};