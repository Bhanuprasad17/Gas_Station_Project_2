const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const chargersRoutes = require('./routes/chargers');  // Import chargers routes

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.end('Welcome to nodejs');
});

app.use('/', authRoutes);               // Auth routes: signup, login etc.
app.use('/api/chargers', chargersRoutes);  // Chargers CRUD routes protected with JWT

module.exports = app;
