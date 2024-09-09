const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongo');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Home Route');
});
app.get('/test', (req, res) => {
  res.send('Test Route');
});
app.use('/auth', authRoutes);
app.use('/', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
