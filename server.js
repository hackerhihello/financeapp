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
require('dotenv').config();


uri=process.env.MONGODB_URI;
console.log('Connecting to MongoDB at:', uri);
// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true ,  socketTimeoutMS: 30000})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  app.get('/',  async (req, res) => { 
  res.send("hello world");
  })

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bank', bankRoutes);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

// Export the app for serverless deployment
module.exports = app;