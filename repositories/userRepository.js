const Company = require('../models/Company');
const Employer = require('../models/employer');
const User = require('../models/user');

class UserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();

      if (user.role === 'employer') {
        await Employer.create({ user: user._id });
        await Company.create({
          user: user._id,
          name: userData.companyName,
          description: userData.description,
          industry: userData.industry,
          size: userData.size,
          website: userData.website,
          logo: userData.logo,
          location: userData.location,
          vision: userData.vision,
          mission: userData.mission,
          ourValues: userData.ourValues,
        });
      }

      return user;
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User
        .findOne({ email })
        .select('+password');
      return user;
    }
    catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      return user;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      await User.findByIdAndDelete(userId);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
}

module.exports = new UserRepository();