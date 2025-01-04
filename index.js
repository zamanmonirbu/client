const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const dotenv = require('dotenv');  // Corrected this line
dotenv.config();

const url = process.env.URI;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/payment", paymentRoutes);



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
