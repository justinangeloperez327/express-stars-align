const Application = require("../models/application");
const Company = require("../models/company");
const Job = require("../models/job");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const getAllApplications = async (req, res, next) => {
  try {

    if (req.role === "employee") {
      const applications = await Application.find({ applicant: req.userId })
        .populate("job")
        .populate("company");

      return res.status(200).json(applications);
    }

    if (req.role === "employer") {
      const company = await Company.findOne({ user: req.userId });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const applications = await Application.find({ company: company._id })
        .populate('job')
        .populate('user', 'email');
      return res.status(200).json(applications);
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (error) {
    next(error);
  }
}

const getApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate("job").populate("user");

    if (!application) {
      res.status(404).json({ message: "Application not found" });
    }

    if (req.role === "employee") {
      const url = cloudinary.url(`resume/${application}.pdf`, {
        resource_type: 'raw',
        type: 'authenticated',
        sign_url: true
      });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
}

const createApplication = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.userId;
    const resumePath = req.file.path;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const result = await cloudinary.uploader.upload(resumePath, {
      folder: 'resume',
      resource_type: "raw",
      public_id: `${userId}_${jobId}_resume`
    });

    // Delete the file from the server after uploading to Cloudinary
    fs.unlinkSync(resumePath);

    const existingApplication = await Application.findOne({ user: userId, job: jobId });

    if (!existingApplication) {
      const application = await Application.create({
        user: userId,
        job: jobId,
        company: existingJob.company._id,
        resume: result.secure_url,
        coverLetter
      });

      if (!application) {
        return res.status(400).json({ message: "Application failed" });
      }

      existingJob.applicants.push(application._id);
      existingJob.save();

      res.status(201).json(application);
    } else {
      existingApplication.resume = result.secure_url;
      existingApplication.coverLetter = coverLetter;
      await existingApplication.save();

      res.status(200).json(existingApplication);
    }
  } catch (error) {
    next(error);
  }
}

const updateApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const { employee, job, answers } = req.body;

    const application = await Application.findByIdAndUpdate(applicationId, {
      employee,
      job,
      answers
    });

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
}

const deleteApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    await Application.findByIdAndDelete(applicationId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

const acceptApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findByIdAndUpdate(applicationId, { status: "accepted" }, { new: true });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  }
  catch (error) {
    next(error);
  }
}

const rejectApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findByIdAndUpdate(applicationId, { status: "rejected" }, { new: true });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  acceptApplication,
  rejectApplication
};