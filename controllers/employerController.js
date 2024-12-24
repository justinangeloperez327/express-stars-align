const Employer = require("../models/employer");

const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers);
  } catch (error) {
    next(error);
  }
}

const getEmployer = async (req, res) => {
  try {
    const employerId = req.params.id;
    const employer = await Employer.findById(employerId);
    if (!employer) {
      res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(employer);
  } catch (error) {
    next(error);
  }
}

const updateEmployer = async (req, res) => {
  try {
    const employerId = req.employerId;

    const {
      name,
      description,
      industry,
      size,
      logo,
      location,
      vision,
      mission,
      ourValues,
    } = req.body;

    const employer = await Employer.findByIdAndUpdate(employerId, {
      name,
      description,
      industry,
      size,
      logo,
      location,
      vision,
      mission,
      ourValues,
    });

    res.status(200).json(employer);
  } catch (error) {
    next(error);
  }
}

const deleteEmployer = async (req, res) => {
  try {
    const employerId = req.params.id;
    await Employer.findByIdAndDelete(employerId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllEmployers,
  getEmployer,
  createEmployer,
  updateEmployer,
  deleteEmployer
};
