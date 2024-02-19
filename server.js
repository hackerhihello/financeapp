    // server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// Use cors middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/financeApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

 // Export routes as functions
const authRoutes = require('./functions/api/auth');
const bankRoutes = require('./functions/api/bank');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bank', bankRoutes);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

// Export the app for serverless deployment
module.exports = app;