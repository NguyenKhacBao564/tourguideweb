///backend/src/app.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const authRoutes = require('./features/auth/routes');
//const tourRoutes = require('./features/tours/routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/auth', authRoutes);
// app.use('/api/tours', tourRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on port', PORT));


