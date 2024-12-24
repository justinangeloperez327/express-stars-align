const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandlers');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes');
const connectToDatabase = require('./config/database');

dotenv.config();

connectToDatabase();
const app = express();
app.use(express.json());


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

