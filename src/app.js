import express from "express";
import ratesRoute from "./routes/rates.js";
import convertRoute from "./routes/convert.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", ratesRoute);
app.use("/api", convertRoute);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

export default app;
