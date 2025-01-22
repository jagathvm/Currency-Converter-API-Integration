// Imports
import { Router } from "express";
import { convertCurrency } from "../controllers/convert-controller.js";

// Routes
const router = Router();

router.post("/convert", convertCurrency);

// Export
export default router;
