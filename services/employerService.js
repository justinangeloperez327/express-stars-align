const Company = require('../models/company');
const Employer = require('../models/employer');

const createEmployer = async (employerData) => {
  try {
    const employer = new Employer(employerData);
    await employer.save();

    const company = await Company.findById(employerData.company);
    company.employers.push(employer._id);
    await company.save();

    return employer;
  } catch (error) {
    throw new Error('Error creating employer: ' + error.message);
  }
};

const getEmployerById = async (id) => {
  try {
    const employer = await Employer.findById(id);
    if (!employer) {
      throw new Error('Employer not found');
    }
    return employer;
  } catch (error) {
    throw new Error('Error fetching employer: ' + error.message);
  }
};

const updateEmployer = async (id, updateData) => {
  try {
    const employer = await Employer.findByIdAndUpdate(id, updateData, { new: true });
    if (!employer) {
      throw new Error('Employer not found');
    }
    return employer;
  } catch (error) {
    throw new Error('Error updating employer: ' + error.message);
  }
};

const deleteEmployer = async (id) => {
  try {
    const employer = await Employer.findByIdAndDelete(id);
    if (!employer) {
      throw new Error('Employer not found');
    }
    return employer;
  } catch (error) {
    throw new Error('Error deleting employer: ' + error.message);
  }
};

module.exports = {
  createEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer
};