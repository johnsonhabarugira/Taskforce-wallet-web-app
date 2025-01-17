const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();
const app = express();

app.use(express.json()); 
app.use(cors({ origin: '*' }));


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/accounts/", require("./routes/accountRoutes"))
app.use("/api/transactions/", require("./routes/transactionRoutes"))
app.use("/api/summary", require("./routes/summaryRoutes"));

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
