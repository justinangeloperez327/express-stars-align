const Application = require("../models/application");
const Job = require("../models/job");

const getAllJobs = async (req, res, next) => {
  try {
    const { search, type, location, dateListed } = req.query;


    // Create a filter object
    const filter = {
      title: { $regex: search || '', $options: 'i' },
      type: { $regex: type || '', $options: 'i' },
      location: { $regex: location || '', $options: 'i' },
      deadline: { $gte: new Date() }
    };

    if (dateListed) {
      const now = new Date();
      let dateFrom;

      switch (dateListed.toLowerCase()) {
        case 'today':
          dateFrom = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'this-week':
          dateFrom = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case 'this-month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'this-year':
          dateFrom = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          dateFrom = new Date(dateListed);
      }

      filter.createdAt = { $gte: dateFrom };
    }

    const jobs = await Job.find(filter).populate('company');

    return res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
}

const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate('company').populate('applicants');

    if (!job) {
      res.status(404).json({ message: "Job not found" });
    }

    const formattedJob = {
      ...job.toObject(),
      deadline: job.deadline.toISOString().split('T')[0],
    };

    res.status(200).json(formattedJob);
  } catch (error) {
    next(error);
  }
}

const getJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const job = await Job.findById(id).populate('company').populate('applicants');

    if (!job) {
      res.status(404).json({ message: "Job not found" });
    }

    if (req.role === 'employee') {

      const application = await Application.findOne({ job: id, user: req.userId });

      const formattedJob = {
        ...job.toObject(),
        deadline: job.deadline.toISOString().split('T')[0],
        applied: application ? true : false,
      };

      return res.status(200).json(formattedJob);
    } else {
      const formattedJob = {
        ...job.toObject(),
        deadline: job.deadline.toISOString().split('T')[0],
      };
      return res.status(200).json(formattedJob);
    }

  } catch (error) {
    next(error);
  }
}

const createJob = async (req, res, next) => {
  try {
    const {
      title,
      type,
      location,
      description,
      requirements,
      salary,
      experience,
      education,
      deadline
    } = req.body;

    const formattedDeadline = new Date(deadline);

    const job = await Job.create({
      title,
      type,
      location,
      description,
      requirements,
      salary,
      experience,
      education,
      deadline: formattedDeadline,
      company: req.companyId,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
}

const updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      type,
      location,
      description,
      requirements,
      salary,
      experience,
      education,
      deadline
    } = req.body;

    const job = await Job.findByIdAndUpdate(jobId, {
      title,
      type,
      location,
      description,
      requirements,
      salary,
      experience,
      education,
      deadline
    }, { new: true });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  }
  catch (error) {
    next(error);
  }
}

const deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
}

const getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ company: req.companyId })
      .populate('company')
      .populate('applicants');

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
}

const getJobApplications = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
    }

    const applications = await Application.find({ job: jobId });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
}

const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { search, type, location, dateListed } = req.query;
    const filter = {
      title: { $regex: search || '', $options: 'i' },
      type: { $regex: type || '', $options: 'i' },
      location: { $regex: location || '', $options: 'i' },
    };

    if (dateListed) {
      const now = new Date();
      let dateFrom;

      switch (dateListed.toLowerCase()) {
        case 'today':
          dateFrom = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'this-week':
          dateFrom = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case 'this-month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'this-year':
          dateFrom = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          dateFrom = new Date(dateListed);
      }

      filter.createdAt = { $gte: dateFrom };
    }

    const applications = await Application.find({ user: userId })
      .populate({
        path: 'job',
        match: filter,
        populate: { path: 'company' }
      });

    const jobs = applications
      .filter(application => application.job) // Ensure job exists
      .map(application => {
        return {
          _id: application.job._id,
          title: application.job.title,
          company: application.job.company,
          location: application.job.location,
          salary: application.job.salary,
          type: application.job.type,
          status: application.status,
          dateApplied: application.createdAt.toISOString().split('T')[0],
        };
      });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getJobApplications,
  getAppliedJobs,
  getJobDetails
};