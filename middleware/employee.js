const Employee = require("../models/employee");
const User = require("../models/user");

const employee = async (req, res, next) => {
  try {
    const role = req.role;
    if (role !== 'employee') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const employee = await Employee.findOne({ user: userId });

    // if (!employee) {
    //   return res.status(404).json({ error: 'Employee not found' });
    // }

    // req.employeeId = employee._id;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = employee;