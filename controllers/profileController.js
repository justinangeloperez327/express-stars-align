const User = require("../models/user");
const Employee = require("../models/employee");
const Employer = require("../models/employer");

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

      const education = employee.education.map(edu => ({
        ...edu.toObject(),
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : null,
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : null,
      }));

      const experience = employee.experience.map(exp => ({
        ...exp.toObject(),
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : null,
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : null,
      }));

      const skills = employee.skills;
      const appliedJobs = employee.appliedJobs;

      const profile = {
        email: user.email,
        role: user.role,
        firstName: employee.firstName ?? null,
        lastName: employee.lastName ?? null,
        middleName: employee.middleName ?? null,
        experience: experience,
        skills: skills,
        education: education,
        appliedJobs: appliedJobs,
      };

      res.status(200).json({ profile });

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
    const employeeId = req.employeeId;
    const { firstName, lastName, middleName } = req.body;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.middleName = middleName;

    await employee.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
}

const getEducation = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.employeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    const education = employee.education.map(edu => ({
      ...edu.toObject(),
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : null,
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : null,
    }));

    res.status(200).json(education);
  } catch (error) {
    next(error);
  }
}

const addEducation = async (req, res, next) => {
  try {
    const { school, degree, startDate, endDate } = req.body;

    const employee = await Employee.findById(req.employeeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    employee.education.push({
      school,
      degree,
      startDate,
      endDate
    });

    await employee.save();
    res.status(201).json({ message: "Education added successfully" });
  }
  catch (error) {
    next(error);
  }
}

const updateEducation = async (req, res, next) => {
  try {

    const { id, school, degree, startDate, endDate } = req.body;

    const employee = await Employee.findById(req.employeeId);
    const education = employee.education.id(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    education.school = school;
    education.degree = degree;
    education.startDate = startDate;
    education.endDate = endDate;

    await employee.save();

    res.status(200).json({ message: "Education updated successfully" });

  } catch (error) {
    next(error);
  }
}

const deleteEducation = async (req, res, next) => {
  try {
    const { educationId } = req.body;

    const employee = await Employee.findById(req.employeeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    const education = employee.education.id(educationId);
    education.remove();

    await employee.save();

    res.status(200).json({ message: "Education removed successfully" });

  } catch (error) {
    next(error);
  }

}

const getExperience = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.employeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    const experience = employee.experience.map(exp => ({
      ...exp.toObject(),
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : null,
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : null,
    }));

    res.status(200).json(experience);
  } catch (error) {
    next(error);
  }
}

const addExperience = async (req, res, next) => {
  try {
    const userId = req.userId;
    const employeId = req.employeeId;
    const { title, company, startDate, endDate } = req.body;

    const employee = await Employee.findById(employeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    employee.experience.push({
      title,
      company,
      startDate,
      endDate
    });

    await employee.save();
    res.status(201).json({ message: "Experience added successfully" });
  }
  catch (error) {
    next(error);
  }
}

const updateExperience = async (req, res, next) => {
  try {
    const userId = req.userId;
    const employeId = req.employeeId;
    const { experienceId } = req.params;
    const { title, company, startDate, endDate } = req.body;

    const employee = await Employee.findById(employeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    const experience = employee.experience.id(experienceId);

    experience.title = title;
    experience.company = company;
    experience.startDate = startDate;
    experience.endDate = endDate;

    await employee.save();

    res.status(200).json({ message: "Experience updated successfully" });
  }
  catch (error) {
    next(error);
  }
}

const deleteExperience = async (req, res, next) => {
  try {
    const userId = req.userId;
    const employeId = req.employeeId;
    const { experienceId } = req.body;

    const employee = await Employee.findById(employeId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    const experience = employee.experience.id(experienceId);
    experience.remove();

    await employee.save();

    res.status(200).json({ message: "Experience removed successfully" });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience
}