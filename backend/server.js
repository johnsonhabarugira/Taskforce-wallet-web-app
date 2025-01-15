const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

connectDB();
const app = express();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors());         // Enable CORS

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/accounts/", require("./routes/accountRoutes"))
app.use("/api/transactions/", require("./routes/transactionRoutes"))

// Error handling middleware (should be the last middleware)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
