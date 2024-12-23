const User = require("../models/user");
const Employee = require("../models/employee");
const Employer = require("../models/employer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email is not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, process.env.JWT_SECRET);

    const userWithoutPassword = await User.findOne({ email }).select('-password -createdAt -updatedAt -__v -_id');

    res.status(200).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

const registerEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'employee' });
    await user.save();

    if (!user) {
      res.status(400).json({ error: "User not created" });
    }

    const employee = new Employee({ user: user._id });
    await employee.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
}

const registerEmployer = async (req, res, next) => {
  try {
    const {
      email,
      password,
      companyName,
      website,
      location,
      industry,
      size,
      vision,
      mission,
      values,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'employer' });

    await user.save();

    if (!user) {
      res.status(400).json({ error: "User not created" });
    }

    const company = new Company({
      user: user._id,
      name: companyName,
      website,
      location,
      industry,
      size,
      vision,
      mission,
      values,
    });

    await company.save();

    if (!company) {
      res.status(400).json({ error: "Company not created" });
    }

    const employer = new Employer({ user: user._id, company: company._id });

    await employer.save();

    if (!employer) {
      res.status(400).json({ error: "Employer not created" });
    }


    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
}

const getEmployeeProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ user, employee });
  } catch (error) {
    next(error);
  }
}

const getEmployerProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const employer = await Employer.findOne({ user: userId });

    if (!employer) {
      res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json({ user, employer });
  } catch (error) {
    next(error);
  }
}

const updateEmployeeProfile = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findById(userId);
    const { experience, skills, resume } = req.body;

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const employee = await Employee.findOne({ user: userId });

    if (employee) {
      employee.experience = experience;
      employee.skills = skills;
      employee.resume = resume;
      await employee.save();

    } else {
      const newEmployee = new Employee({ user: userId, experience, skills, resume });
      await newEmployee.save();
    }

    res.status(400).json({ message: "Profile Updated" });
  } catch (error) {
    next(error);
  }
}

const updateEmployerProfile = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const employer = await Employer.findOne({ user: userId });

    if (!employer) {
      res.status(404).json({ message: "Employer not found" });
    }

    const { companyName, companyDescription, website } = req.body;

    employer.companyName = companyName;

    employer.companyDescription = companyDescription;

    employer.website = website;

    await employer.save();

  } catch (error) {
    next(error);
  }
}

const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'employee') {
      const employee = await Employee.findOne({ user: userId }).populate('user');

      if (!employee) {
        res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ user, employee });
    } else if (user.role === 'employer') {
      const employer = await Employer.findOne({ user: userId });

      if (!employer) {
        res.status(404).json({ message: "Employer not found" });
      }

      res.status(200).json({ user, employer });
    }
  } catch (error) {
    next(error);
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'employee') {
      const employee = await Employee.findOne({ user: userId }, req.body);

      if (!employee) {
        res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ user, employee });
    } else if (user.role === 'employer') {

      const {
        companyName,
        location,
        industry,
        size,
        vision,
        mission,
        values,
      } = req.body;

      const employer = await Employer.findOne({ user: userId });

      const company = await Company.findOne({ user: userId });
      company.name = companyName;
      company.location = location;
      company.industry = industry;
      company.size = size;
      company.vision = vision;
      company.mission = mission;
      company.ourValues = values;

      await company.save();

      if (!employer) {
        res.status(404).json({ message: "Employer not found" });
      }

      res.status(200).json({ user, employer });
    }

  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  registerEmployee,
  registerEmployer,
  getEmployeeProfile,
  getEmployerProfile,
  updateEmployeeProfile,
  updateEmployerProfile,
  getProfile
};