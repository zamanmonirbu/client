const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');
const cors=require('cors');

dotenv.config();
const app = express();

app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use('/api/payments', paymentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
