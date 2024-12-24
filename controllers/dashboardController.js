const Application = require("../models/application");
const Company = require("../models/company");
const Job = require("../models/job");

const getDashboardData = async (req, res, next) => {
  try {
    if (req.role === "admin") {
      const totalJobs = await Job.countDocuments();
      const totalActiveJobs = await Job.countDocuments({ deadline: { $gt: new Date() } });
      const totalCloseJobs = await Job.countDocuments({ deadline: { $lt: new Date() } });

      const totalApplications = await Application.countDocuments();
      const totalViewedApplications = await Application.countDocuments({ status: "viewed" });
      const totalPendingApplications = await Application.countDocuments({ status: "pending" });

      return res.status(200).json({
        totalJobs,
        totalActiveJobs,
        totalCloseJobs,
        totalApplications,
        totalViewedApplications,
        totalPendingApplications
      });
    }

    if (req.role === "employer") {
      const company = await Company.findOne({ user: req.userId });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const jobs = await Job.find({ company: company._id });
      const totalJobs = jobs.length;
      const totalActiveJobs = jobs.filter(job => job.deadline > new Date()).length;
      const totalCloseJobs = jobs.filter(job => job.deadline < new Date()).length;

      const applications = await Application.find({ company: company._id });
      const totalApplications = applications.length;
      const totalViewedApplications = applications.filter(application => application.status === "viewed").length;
      const totalPendingApplications = applications.filter(application => application.status === "pending").length;

      return res.status(200).json({
        totalJobs,
        totalActiveJobs,
        totalCloseJobs,
        totalApplications,
        totalViewedApplications,
        totalPendingApplications
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