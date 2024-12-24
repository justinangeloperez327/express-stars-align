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

    return res.status(200).json({
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

    // check password if 6 characters
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'employee' });
    await user.save();

    if (!user) {
      return res.status(400).json({ error: "User not created" });
    }

    const employee = new Employee({ user: user._id });
    await employee.save();

    return res.status(201).json({ message: "User registered successfully" });
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
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: 'employer'
    });

    await user.save();

    if (!user) {
      return res.status(400).json({ error: "User not created" });
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
      return res.status(400).json({ error: "Company not created" });
    }

    const employer = new Employer({ user: user._id, company: company._id });

    await employer.save();

    if (!employer) {
      return res.status(400).json({ error: "Employer not created" });
    }


    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  registerEmployee,
  registerEmployer,
};