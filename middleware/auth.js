const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

module.exports = auth;