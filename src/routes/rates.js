// Imports
import { Router } from "express";
import { getRates } from "../controllers/rates-controller.js";

// Routes
const router = Router();

router.get("/rates", getRates);

// Export
export default router;
