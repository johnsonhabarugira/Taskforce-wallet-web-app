const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  // Remove deprecated options
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const app = express();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors());         // Enable CORS

// Routes
app.use("/api/auth", require("./routes/auth"));

// Error handling middleware (should be the last middleware)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
