// Imports
import "dotenv/config";
import express from "express";
import ratesRoute from "./routes/rates.js";
import convertRoute from "./routes/convert.js";

// App
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", ratesRoute);
app.use("/api", convertRoute);

// Error Handling
app.use((err, req, res, next) => {
  console.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, message: "Internal Server Error." });
});

// Export
export default app;
