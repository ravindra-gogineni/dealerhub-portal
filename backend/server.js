const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('DealerHub Portal API is running (Zero-Config Mode)...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Database: NeDB (Local Files)');
});
