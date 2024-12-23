const Company = require("../models/company");

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
}

const getCompany = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);

  } catch (error) {
    next(error);
  }
}

export { getAllCompanies, getCompany };