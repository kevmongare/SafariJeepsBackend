// require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter = require('./Routes/users'); // Import the users route
const guideRouter = require('./Routes/guides'); // Import the guides route

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('Backend server running. I know you can do it Kev');
});

// Mount user routes
app.use('/api', usersRouter);
app.use('/guides', guideRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
